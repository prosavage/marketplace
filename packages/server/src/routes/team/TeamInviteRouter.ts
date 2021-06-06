import {Team, TeamInvite} from "@savagelabs/types";
import express, {Request, Response} from "express";
import {body, param} from "express-validator";
import shortid from "shortid";
import {getInvites, getTeams, getUsers, INVITED_COLLECTION, TEAMS_COLLECTION,} from "../../constants";
import {Authorize} from "../../middleware/Authenticate";
import {isValidBody} from "../../middleware/BodyValidate";
import {getDatabase} from "../../server";

const teamInviteRouter = express.Router();

const deleteInvite = async (_id: string) => {
    await getDatabase()
        .collection<TeamInvite>(INVITED_COLLECTION)
        .deleteOne({_id});
};


teamInviteRouter.put("/",
    [body(["team", "invitee"]).custom(v => shortid.isValid(v)), isValidBody, Authorize],
    async (req: Request, res: Response) => {

        const inviteeUser = await getUsers().findOne({_id: req.body.invitee})
        if (inviteeUser === null) {
            res.failure("user does not exist.")
            return
        }

        const team = await getTeams().findOne({_id: req.body.team});
        if (team === null) {
            res.failure("team does not exist")
            return;
        }

        if (team.owner !== req.user!._id) {
            res.failure("you cannot invite someone to this team since you do not own it.")
            return;
        }

        if (team.members.includes(inviteeUser._id)) {
            res.failure("This member is already part of your team");
            return;
        }

        const existingInvite = await getInvites().findOne({invitee: req.body.invitee, team: req.body.team});

        if (existingInvite !== null) {
            res.failure("This member is already invited to your team.")
            return;
        }

        const invite: TeamInvite = {
            _id: shortid.generate(),
            invitee: req.body.invitee,
            team: req.body.team
        }

        await getInvites().insertOne(invite)

        res.success({invite})
})

teamInviteRouter.delete("/:id",
    [param("id").custom(v => shortid.isValid(v)), isValidBody, Authorize],
    async (req: Request, res: Response) => {
    const id = req.params.id;
    const invite = await getInvites().findOne({_id: id});

    if (invite === null) {
        res.failure("invite does not exist.")
        return
    }

    const team = await getTeams().findOne({_id: invite.team});

    if (team == null) {
        res.failure("this team does not exist.")
        await deleteInvite(invite._id);
        return;
    }

    if (team.owner !== req.user!._id) {
        res.failure("You do not own this team; So you cannot delete this invite.")
        return
    }

    await deleteInvite(invite._id);
    res.success({invite})
})

teamInviteRouter.get("/deny/:id", [param("id").custom((v) => shortid.isValid(v)), isValidBody, Authorize], 
async (req: Request, res: Response) => {
    const id = req.params.id;

    const invite = await getDatabase()
        .collection<TeamInvite>(INVITED_COLLECTION)
        .findOne({_id: id});
    if (invite === null) {
        res.failure("invite does not exist.");
        return;
    }
    if (invite.invitee !== req.user!!._id) {
        res.failure("You cannot deny this invite.");
        return;
    }

    const team = await getDatabase()
        .collection<Team>(TEAMS_COLLECTION)
        .findOne({_id: invite.team});

    if (team === null) {
        await deleteInvite(invite._id);
        res.failure("team does not exist.");
        return;
    }

    await deleteInvite(invite._id);

    res.success({invite});
})

teamInviteRouter.get(
    "/accept/:id",
    [param("id").custom((v) => shortid.isValid(v)), isValidBody, Authorize],
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const invite = await getDatabase()
            .collection<TeamInvite>(INVITED_COLLECTION)
            .findOne({_id: id});
        if (invite === null) {
            res.failure("invite does not exist.");
            return;
        }

        if (invite.invitee !== req.user!!._id) {
            res.failure("You cannot accept this invite.");
            return;
        }

        const team = await getDatabase()
            .collection<Team>(TEAMS_COLLECTION)
            .findOne({_id: invite.team});

        if (team === null) {
            await deleteInvite(invite._id);
            res.failure("team does not exist.");
            return;
        }

        // Put member in team.
        await getDatabase()
            .collection<Team>(TEAMS_COLLECTION)
            .updateOne({_id: invite.team}, {$push: {members: invite.invitee}});


        await deleteInvite(invite._id);

        res.success({invite});
    }
);

export default teamInviteRouter;
