import express, { Request, Response } from "express";
import { body } from "express-validator";
import { ObjectId } from "mongodb";
import { VERSIONS_COLLECTION } from "../constants";
import { Authorize } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { getDatabase } from "../server";

const versionRouter = express.Router();

versionRouter.put("/", [
    body(["title", "version", "description"]).isString(),
    body("resource").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const body = req.body;
    const version = {title: body.title, version: body.version, timestamp: new Date(), resource: body.resource};
    await getDatabase().collection(VERSIONS_COLLECTION).insertOne(version);
    res.success({version})
})



export default versionRouter;