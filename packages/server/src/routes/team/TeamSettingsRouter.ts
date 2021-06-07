import express, { Request, Response } from "express";
import { body } from "express-validator";
import { getTeams } from "../../constants";
import { Authorize, FetchTeam } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";

const teamSettingsRouter = express.Router();

teamSettingsRouter.post(
  "/discord-server",
  [body("serverID").isString(), isValidBody, Authorize, FetchTeam],
  async (req: Request, res: Response) => {
    const serverID = req.body.serverID;

    if (!req.team.owned) {
      res.failure("You can only edit settings for a team you own.")
      return
    }

    await getTeams()
      .updateOne({ _id: req.team.owned._id }, { $set: { discordServerId: serverID } });

    res.success({ serverID });
  }
);

export default teamSettingsRouter;
