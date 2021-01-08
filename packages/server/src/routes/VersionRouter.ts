import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { RESOURCES_COLLECTION, REVIEWS_COLLECTION, VERSIONS_COLLECTION } from "../constants";
import { Authorize } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { bunny, getDatabase } from "../server";
import { Role } from "../struct/Role";
import { Resource } from "../types/Resource";
import { Review } from "../types/Review";
import { Version } from "../types/Version";

const versionRouter = express.Router();

versionRouter.put("/", [
    body(["title", "version", "description"]).isString(),
    body("resource").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const body = req.body;
    const version = {
        title: body.title,
        description: body.description,
        version: body.version,
        timestamp: new Date(),
        resource: body.resource,
        author: req.user!!._id
    };
    await getDatabase().collection(VERSIONS_COLLECTION).insertOne(version);
    res.success({ version })
})

versionRouter.put("/:id", [
    param("id").isMongoId().bail().customSanitizer(v => new ObjectId(v)),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const id = req.params.id as unknown as ObjectId;

    const version = await getDatabase().collection<Version>(VERSIONS_COLLECTION).findOne({ _id: id });
    if (!version) {
        res.failure("version not found.")
        return;
    }

    const resource = await getDatabase().collection<Resource>(RESOURCES_COLLECTION).findOne({ _id: version.resource });
    if (!resource) {
        res.failure("resource not found");
        return;
    }

    try {
        const versionFile = await bunny.getVersionFile(resource, version);
        if (versionFile.data) {
            res.failure("already uploaded.")
            return;
        }
    } catch (err) {
        if (err.response.status !== 404) {
            res.failure("something went wrong" + err.response.statusText);
            return;
        }
    }
    

    if (req.user!!.role < Role.ADMIN && !req.user!!._id.equals(resource.owner)) {
        res.failure("You do not have permission to access this resource or version.");
        return;
    }

    if (!req.files || !req.files!!.resource) {
        res.failure("invalid body was sent.");
        return;
    }

    const file = req.files!!.resource as any;
    const result = await bunny.putVersionFile(resource, version, file.data)
    res.success({ result: result.data });
})

versionRouter.get("/:id", [
    param("id").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    isValidBody
], async (req: Request, res: Response) => {
    const id = req.params.id;
    const version = await getDatabase().collection(VERSIONS_COLLECTION).findOne({ _id: id });
    res.success(version)
})

versionRouter.delete("/", [
    body("id").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const user = req.user!!;
    const versionId = req.body.id
    const version = await getDatabase().collection<Version>(VERSIONS_COLLECTION).findOne({ _id: versionId });
    if (!version) {
        res.failure("This version does not exist.");
        return;
    }
    // permission check logic.
    if (user.role < Role.ADMIN && !version?.author.equals(user._id)) {
        res.failure("You do not have permission to delete this version.");
        return;
    }
    const results = await getDatabase().collection<Version>(VERSIONS_COLLECTION).deleteOne({ _id: versionId });
    // if we find one, then delete reviews for that version.
    const reviews = await getDatabase().collection<Review>(REVIEWS_COLLECTION).deleteMany({ version: versionId })
    res.success({ result: { deletedVersion: results?.deletedCount, reviewsDeleted: reviews?.deletedCount } });
})



export default versionRouter;