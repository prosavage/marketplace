
import express, { Request, Response } from "express";
import { body } from "express-validator";
import shortid from "shortid";
import { getTeams } from "../../constants";
import { Authorize, FetchTeam } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";


const directoryTeamMemberRouter = express.Router();

directoryTeamMemberRouter.post("/kick",
 [body(["member"]).custom(v => shortid.isValid(v)), isValidBody, Authorize, FetchTeam], 
 async (req: Request, res: Response) => {
    const team = req.team.owned;

    if (!team) {
        res.failure("You do not own a team, and cannot kick members.");
        return;
    }
    const member = req.body.member;

    if (!team.members.includes(member)) {
        res.failure("The member specified is not in your owned team.");
        return;
    }

    const writeOp = await getTeams().updateOne({ _id: team._id }, { $pull: { members: member } });
    res.success({result: writeOp.result});
})


export default directoryTeamMemberRouter;