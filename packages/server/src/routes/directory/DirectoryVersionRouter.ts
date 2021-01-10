import express, { Request, Response } from "express";
import { param } from "express-validator";
import { ObjectId } from "mongodb";
import { RESOURCES_COLLECTION, VERSIONS_COLLECTION } from "../../constants";
import { Authorize } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { bunny, getDatabase } from "../../server";
import { Resource } from "../../types/Resource";
import { Version } from "../../types/Version";

const directoryVersionRouter = express.Router();

directoryVersionRouter.get("/resource/:resource/:page", [
    param("resource").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    param("page").isInt().bail().toInt().custom(v => v > 0).bail(),
    isValidBody
],
    async (req: Request, res: Response) => {
        const page = Number.parseInt(req.params.page!!);
        const versions = await pageSearchVersionsWithFilter({ resource: req.params.resource }, page)
        res.success({ versions })
    }
);

directoryVersionRouter.get("/resource/:version", [
    param("version").isMongoId().bail().customSanitizer(v => new ObjectId(v)),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const versionId = req.params.version as unknown as ObjectId

    const version = await getDatabase().collection<Version>(VERSIONS_COLLECTION).findOne({ _id: versionId });
    
    if (!version) {
        res.failure("version not found.")
        return;
    }

    const resource = await getDatabase().collection<Resource>(RESOURCES_COLLECTION).findOne({ _id: version.resource });

    if (!resource) {
        res.failure("resource not found.")
        return;
    }
    const file = await bunny.getVersionFile(resource, version)
    res.send(file.data)
})

const pageSearchVersionsWithFilter = async (filter: object, page: number) => {
    const limit = 10
    return await getDatabase().collection(VERSIONS_COLLECTION).find(filter)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
}

export default directoryVersionRouter;