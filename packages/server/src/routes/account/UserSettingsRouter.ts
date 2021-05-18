import express, { Request, Response } from "express";
import { body } from "express-validator";
import { USERS_COLLECTION } from "../../constants";
import { Authorize } from "../../middleware/Authenticate";
import { getDatabase } from "../../server";
import { User } from "../../types/User";
import { isValidBody } from "../../middleware/BodyValidate";

const userSettings = express.Router();

userSettings.post(
  "/discord-server",
  [body("serverID").isString(), isValidBody, Authorize],
  async (req: Request, res: Response) => {
    const serverID = req.body.serverID;

    const user = req.user!!;

    await getDatabase()
      .collection<User>(USERS_COLLECTION)
      .updateOne({ _id: user._id }, { $set: { discordServerId: serverID } });

    res.success({ serverID: user.discordServerId });
  }
);

export default userSettings;
