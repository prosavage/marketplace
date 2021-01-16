import express, { Request, Response } from "express";
import bcrypt from "bcrypt";

import crypto from "crypto";
import { getDatabase, tokenMap } from "../server";
import { USERS_COLLECTION } from "../constants";
import { User } from "../types/User";
import { Role } from "../struct/Role";
import { isValidBody } from "../middleware/BodyValidate";
import { body } from "express-validator";

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
        discordServerId: user.discordServerId,
        hasIcon: user.hasIcon,
      },
    });
  }
);

authRouter.post(
  "/signup",
  [
    body("username").isString().bail().isLength({ min: 4, max: 20 }),
    body("email").isEmail(),
    body("password").isStrongPassword(),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const user: User = req.body;
    user.role = Role.USER;
    user.discordServerId = undefined;

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
        discordServerId: user.discordServerId,
        hasIcon: user.hasIcon,
      },
    });
  }
);

const generateToken = async (user: User) => {
  const token = (await crypto.randomBytes(48)).toString("hex");
  tokenMap.set(token, user._id);
  return token;
};

export default authRouter;
