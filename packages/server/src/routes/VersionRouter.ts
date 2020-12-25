import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { VERSIONS_COLLECTION } from "../constants";
import { Authorize, hasPermissionForResource } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { getDatabase } from "../server";
import { Role } from "../struct/Role";
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

    // permission check logic.
    if (user.role < Role.ADMIN) {
        const version = await getDatabase().collection<Version>(VERSIONS_COLLECTION).findOne({ _id: versionId });
        if (!version?.author.equals(user._id)) {
            res.failure("You do not have permission to delete this review.");
            return;
        }
    }
    
    const result = await getDatabase().collection(VERSIONS_COLLECTION).deleteOne({ _id: versionId });
    res.success({ result: { deletedCount: result.deletedCount } });
})



export default versionRouter;