import {Team} from "@savagelabs/types";
import express, {Request, Response} from "express";
import {param} from "express-validator";
import shortid from "shortid";
import {getTeams, TEAMS_COLLECTION, USERS_COLLECTION} from "../../constants";
import {isValidBody} from "../../middleware/BodyValidate";
import {getDatabase} from "../../server";
import directoryTeamMemberRouter from "./DirectoryTeamMemberRouter";

const directoryTeamRouter = express.Router();



directoryTeamRouter.get(
    "/by-member/:id",
    [param("id").custom((id) => shortid.isValid(id)), isValidBody],
    async (req: Request, res: Response) => {
        const id: string = req.params.id!;
        const team = await getDatabase()
            .collection<Team>(TEAMS_COLLECTION)
            .find({$or: [{owner: id}, {members: {$in: [id]}}]})
            .toArray();

        res.success({team});
    }
);

directoryTeamRouter.get(
    "/with-members/:id",
    [param("id").custom((id) => shortid.isValid(id)), isValidBody],
    async (req: Request, res: Response) => {
        const id: string = req.params.id!;

        const team = await getTeams().aggregate([
            {$match: {_id: id}},
            {
                $lookup: {
                    from: USERS_COLLECTION,
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner",
                }
            },
            {$unwind: "$owner"},
            {$unset: ["owner.password", "owner.role", "owner.email", "owner.purchases"]},
            {
                $lookup: {
                    from: USERS_COLLECTION,
                    localField: "members",
                    foreignField: "_id",
                    as: "members",
                },
            },
            {$unset: ["members.password", "members.role", "members.email", "members.purchases"]},
        ]).toArray()


        res.success({team: team[0]});
    }
);

directoryTeamRouter.use("/member", directoryTeamMemberRouter);


export default directoryTeamRouter;
