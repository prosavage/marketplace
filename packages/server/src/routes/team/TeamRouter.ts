import {Team, TeamInvite} from "@savagelabs/types/src/Team";
import express, {Request, Response} from "express";
import {body, param} from "express-validator";
import shortid from "shortid";
import {INVITED_COLLECTION, TEAMS_COLLECTION, USERS_COLLECTION,} from "../../constants";
import {Authorize} from "../../middleware/Authenticate";
import {isValidBody} from "../../middleware/BodyValidate";
import {getDatabase} from "../../server";
import { User } from "@savagelabs/types";

const teamRouter = express.Router();

teamRouter.get(
    "/:id",
    [param("id").custom((v) => shortid.isValid(v)), isValidBody],
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const team = await getDatabase()
            .collection<Team>(TEAMS_COLLECTION)
            .findOne({_id: id});
        res.success({team});
    }
);

teamRouter.delete(
    "/:id",
    [param("id").custom((v) => shortid.isValid(v)), isValidBody, Authorize],
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const team = await getDatabase()
            .collection<Team>(TEAMS_COLLECTION)
            .deleteOne({_id: id});
        res.success({result: team.acknowledged});
    }
);

teamRouter.put(
    "/",
    [
        body("name").isString().bail().isLength({
            min: 3,
            max: 20,
        }),
        body("hasIcon").isBoolean(),
        body("members").isArray(),
        isValidBody,
        Authorize,
    ],
    async (req: Request, res: Response) => {
        const teamByName = await getDatabase()
            .collection(TEAMS_COLLECTION)
            .findOne({name: req.body.name});
        if (teamByName !== null) {
            res.failure("team name is already taken.");
            return;
        }

        const myTeam = await getDatabase().collection<Team>(TEAMS_COLLECTION).findOne({owner: req.user!!._id})
        if (myTeam !== null) {
            res.failure("You already own a team.")
            return
        }


        // gotta validate these members
        const members: string[] = req.body.members;
        if (members.includes(req.user._id)) {
            res.failure("cannot invite leader.");
            return;
        }
        const areMembersValid = await Promise.all(
            members.map(async (member) => {
                if (!shortid.isValid(member)) {
                    return false;
                }

                const user = await getDatabase()
                    .collection<User>(USERS_COLLECTION)
                    .findOne({_id: member});
                return user !== null;
            })
        );

        if (areMembersValid.includes(false)) {
            res.failure("invalid member given.");
            return;
        }

        const team: Team = {
            _id: shortid.generate(),
            owner: req.user._id,
            name: req.body.name,
            discordServerId: undefined,
            hasIcon: req.body.hasIcon,
            // they need to accept the invite.
            members: [],
        };

        const invites = members.map((member) => {
            return {
                _id: shortid.generate(),
                team: team._id,
                invitee: member,
            };
        });
        if (invites.length !== 0) {
            await getDatabase()
            .collection<TeamInvite>(INVITED_COLLECTION)
            .insertMany(invites);
        }
        
        await getDatabase().collection<Team>(TEAMS_COLLECTION).insertOne(team);

        res.success({team});
    }
);

export default teamRouter;
