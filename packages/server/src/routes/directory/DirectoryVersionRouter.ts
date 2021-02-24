import express, {Request, Response} from "express";
import {param} from "express-validator";

import shortid from "shortid";
import {RESOURCES_COLLECTION, VERSIONS_COLLECTION} from "../../constants";
import {Authorize} from "../../middleware/Authenticate";
import {isValidBody} from "../../middleware/BodyValidate";
import {bunny, getDatabase} from "../../server";
import {Resource} from "../../types/Resource";
import {Version} from "../../types/Version";

const directoryVersionRouter = express.Router();

directoryVersionRouter.get("/resource/:resource/:page", [
        param("resource").custom(id => shortid.isValid(id)),
        param("page").isInt().bail().toInt().custom(v => v > 0).bail(),
        isValidBody
    ],
    async (req: Request, res: Response) => {
        const page = Number.parseInt(req.params.page!!);
        const versions = await pageSearchVersionsWithFilter({resource: req.params.resource}, page)
        res.success({versions})
    }
);

directoryVersionRouter.get("/download/:version", [
    param("version").custom(id => shortid.isValid(id)),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const versionId = req.params.version as string;

    const version = await getDatabase().collection<Version>(VERSIONS_COLLECTION).findOne({_id: versionId});

    if (!version) {
        res.failure("version not found.")
        return;
    }

    const resource = await getDatabase().collection<Resource>(RESOURCES_COLLECTION).findOne({_id: version.resource});

    if (!resource) {
        res.failure("resource not found.")
        return;
    }

    if (resource.price !== 0 && !req.user!!.purchases.includes(resource?._id)) {
        res.failure("You do not own this resource.")
        return
    }

    try {
        const file = await bunny.getVersionFile(resource, version)
        res.send(file.data)

    } catch (err) {
        res.failure(err.response.data.Message)
    }

})

const pageSearchVersionsWithFilter = async (filter: object, page: number) => {
    const limit = 3
    return await getDatabase().collection(VERSIONS_COLLECTION).find(filter)
        .sort({timestamp: -1})
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray();
}

export default directoryVersionRouter;