import { Role, User } from "@savagelabs/types";
import bcrypt from "bcrypt";
import crypto from "crypto";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import shortid from "shortid";
import { TOKENS_COLLECTION, USERS_COLLECTION } from "../constants";
import { Authorize } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { getDatabase, tokenMap } from "../server";

const authRouter = express.Router();

authRouter.post(
  "/login",
  [body("email").isEmail(), body("password").isString(), isValidBody],
  async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;
    let user: User | null = await getDatabase()
      .collection(USERS_COLLECTION)
      .findOne({ email });
    if (!user) {
      res.failure("Invalid email or password.");
      return;
    }
    // if comparison fails, we deny.
    if (!bcrypt.compareSync(password, user.password)) {
      res.failure("Invalid email or password.");
      return;
    }
    const token = await generateToken(user);
    res.success({
      token,
      user: {
        _id: user._id,
        username: user.username,
        hasIcon: user.hasIcon,
      },
    });
  }
);

export const validatePassword = (password: string) => {
  return (
    hasPasswordLength(password) &&
    containsSpecialCharacters(password) &&
    containsNumbers(password) &&
    containsUppercaseChar(password)
  );
};

const hasPasswordLength = (str: string) => {
  return str.length > 8;
};

const containsSpecialCharacters = (str: string) => {
  return /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(str);
};

const containsNumbers = (str: string) => {
  return /\d/.test(str);
};
const containsUppercaseChar = (str: string) => {
  let hasUppercase = false;
  for (const char of str) {
    if (containsSpecialCharacters(char)) continue;
    if (char === char.toUpperCase()) hasUppercase = true;
  }
  return hasUppercase;
};

authRouter.post(
  "/signup",
  [
    body("username").isString().bail().isLength({ min: 3, max: 20 }),
    body("email").isEmail(),
    body("password").custom((v) => validatePassword(v)),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const user: User  = {
      _id: shortid.generate(),
      role: Role.USER,
      purchases: [],
      email: req.body.email,
      hasIcon: false,
      username: req.body.username,
      password: req.body.password
    }

    let usersWithEmail = await getDatabase()
      .collection(USERS_COLLECTION)
      .find({ email: user.email })
      .toArray();
    if (usersWithEmail.length != 0) {
      res.failure("This email is already taken.");
      return;
    }
    let usersWithUsername = await getDatabase()
      .collection(USERS_COLLECTION)
      .find({ username: user.username })
      .toArray();
    if (usersWithUsername.length != 0) {
      res.failure("This username is already taken.");
      return;
    }
    // hash the password, so its not plaintext.
    user.password = bcrypt.hashSync(user.password, 10);
    await getDatabase().collection(USERS_COLLECTION).insertOne(user);
    const token = await generateToken(user);
    res.success({
      token: token,
      user: {
        _id: user._id,
        username: user.username,
        hasIcon: user.hasIcon,
        purchases: user.purchases,
        role: user.role,
      },
    });
  }
);

authRouter.post("/logout", Authorize, async (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) {
    res.failure("no token found.");
    return;
  }
  const result = tokenMap.delete(token);
  await getDatabase().collection(TOKENS_COLLECTION).deleteOne({ token: token });
  res.success({ token, removed: result });
});

authRouter.post(
  "/validate",
  [body("token").isString().bail().isLength({ min: 96, max: 96 }), isValidBody],
  async (req: Request, res: Response) => {
    const token = req.body.token;
    const userId = tokenMap.get(token);
    if (!userId) {
      res.failure("token is invalid");
      return;
    }
    const user = await getDatabase()
      .collection(USERS_COLLECTION)
      .findOne({ _id: userId });
    if (!user || user === null) {
      res.failure("user is invalid");
      return;
    }

    res.success({
      user: {
        _id: user._id,
        username: user.username,
        discordServerId: user.discordServerId,
        hasIcon: user.hasIcon,
        purchases: user.purchases,
        role: user.role,
      },
    });
  }
);

const generateToken = async (user: User) => {
  const token = (await crypto.randomBytes(48)).toString("hex");
  tokenMap.set(token, user._id);
  // insert into database for persistence.
  getDatabase()
    .collection(TOKENS_COLLECTION)
    .insertOne({ token: token, user: user._id });
  return token;
};

export default authRouter;
