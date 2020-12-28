import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { REVIEWS_COLLECTION, VERSIONS_COLLECTION } from "../constants";
import { Authorize } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { getDatabase } from "../server";
import { Role } from "../struct/Role";
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
        version: body.version,
        timestamp: new Date(),
        resource: body.resource,
        author: req.user!!._id
    };
    await getDatabase().collection(VERSIONS_COLLECTION).insertOne(version);
    res.success({ version })
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