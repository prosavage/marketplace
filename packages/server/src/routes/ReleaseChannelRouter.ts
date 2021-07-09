import express, {Request, Response} from "express";
import { body, param } from "express-validator";
import shortid from "shortid";
import { ReleaseChannel, Role } from "../../../types";
import { getReleaseChannels, getResources } from "../constants";
import { Authorize, FetchTeam, hasPermissionForResource } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { canUseResource, isShortId } from "../util";

const releaseChannelRouter = express.Router();


releaseChannelRouter.put("/", [
    body("name").isString().bail().isLength({min: 4, max: 20}),
    body("description").isString().bail().isLength({max: 60}),
    body("resource").custom(isShortId),
    isValidBody,
    Authorize,
    FetchTeam,
    hasPermissionForResource("resource", Role.MODERATOR)
], async (req: Request, res: Response) => {
    const releaseChannel: ReleaseChannel = {
         _id: shortid.generate(),
        name: req.body.name,
        description: req.body.description,
        resource: req.body.resource
    }

    await getReleaseChannels().insertOne(releaseChannel);
    res.success(releaseChannel)
})

releaseChannelRouter.get("/:id", [
    param("id").custom(isShortId),
    isValidBody
], async (req: Request, res: Response) => {
    const releaseChannel = await getReleaseChannels().findOne({_id: req.params.id});
    if (releaseChannel === null) {
        res.failure("Not found", 404);
        return;
    }

    res.success(releaseChannel);
})

releaseChannelRouter.delete("/:id", [
    param("id").custom(isShortId),
    isValidBody,
    Authorize,
    FetchTeam,
], async (req: Request, res: Response) => {
    const releaseChannel = await getReleaseChannels().findOne({_id: req.params.id});
    if (releaseChannel === null) {
        res.failure("Not found", 404);
        return;
    }

    const resource = await getResources().findOne({_id: releaseChannel.resource});

    if (resource === null) {
        res.failure("this resource does not exist, deleting this release channel...");
        await getReleaseChannels().deleteOne({_id: releaseChannel._id});
        return;
    }

    if (!canUseResource(resource, req.team.getAllTeams())) {
        res.failure("You cannot access this resource/release channel.");
        return;
    }

    await getReleaseChannels().deleteOne({_id: releaseChannel._id});

    res.success(releaseChannel);
})


export default releaseChannelRouter;