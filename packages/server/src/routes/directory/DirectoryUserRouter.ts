import express, { Request, Response } from "express";
import { param } from "express-validator";
import shortid from "shortid";
import { USERS_COLLECTION } from "../../constants";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { User } from "@savagelabs/types";

const directoryUserRouter = express.Router();

directoryUserRouter.get(
  "/by-id/:id",
  [param("id").custom((id) => shortid.isValid(id)), isValidBody],
  async (req: Request, res: Response) => {
    const user = await getDatabase()
      .collection<User>(USERS_COLLECTION)
      .findOne({ _id: req.params.id as string });

    if (user === null) {
      res.failure("user not found");
      return;
    }

    res.success({
      user: {
        _id: user?._id,
        username: user?.username,
        hasIcon: user?.hasIcon,
      },
    });
  }
);

directoryUserRouter.get(
  "/by-email/:email",
  [param("email").isEmail(), isValidBody],
  async (req: Request, res: Response) => {
    const user = await getDatabase()
      .collection<User>(USERS_COLLECTION)
      .findOne({ email: req.params.email as string });

    if (user === null) {
      res.failure("user not found");
      return;
    }

    res.success({
      user: {
        _id: user?._id,
        username: user?.username,
        hasIcon: user?.hasIcon,
      },
    });
  }
);

export default directoryUserRouter;
