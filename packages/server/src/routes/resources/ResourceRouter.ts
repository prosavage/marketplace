import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { RESOURCES_COLLECTION, REVIEWS_COLLECTION, VERSIONS_COLLECTION } from "../../constants";
import { atleastRole, Authorize, hasPermissionForResource } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { bunny, getDatabase } from "../../server";
import { Role } from "../../struct/Role";
import { Category } from "../../types/Category";
import { Version } from "../../types/Version";
import resourceIconRouter from "./ResourceIconRouter";

const resourceRouter = express.Router()
interface ResourceAddBody {
    updated: Date;
    name: string,
    category: Category["_id"],
    thread: string,
    version: Version
}


resourceRouter.use("/icon", resourceIconRouter);

resourceRouter.get("/:id", [
    param("id").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    isValidBody
], async (req: Request, res: Response) => {
    const id = req.params.id;
    const resource = await getDatabase().collection(RESOURCES_COLLECTION).findOne({ _id: id });
    res.success({ resource })
})

resourceRouter.put("/", [
    body(["name", "thread", "category", "version"]).exists(),
    body("category").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    body(["version.title", "version.description", "version.version"]).isString(),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const resource = req.body as ResourceAddBody;
    resource.version.timestamp = new Date();
    resource.updated = new Date();
    const database = getDatabase();
    const resourceToAdd =
    {
        name: resource.name,
        category: resource.category,
        thread: resource.thread,
        owner: req.user!!._id,
        ratings: [],
        versions: [resource.version],
        updated: resource.updated
    }
    database.collection(RESOURCES_COLLECTION).insertOne(resourceToAdd);
    res.success({ resouce: resourceToAdd })
})



resourceRouter.delete("/", [
    body("id").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    Authorize,
    atleastRole(Role.MODERATOR),
    isValidBody
], async (req: Request, res: Response) => {
    const result = await getDatabase().collection(RESOURCES_COLLECTION).deleteOne({ _id: req.body.id })
    const reviews = await getDatabase().collection(REVIEWS_COLLECTION).deleteMany({ resource: req.body.id })
    const versions = await getDatabase().collection(VERSIONS_COLLECTION).deleteMany({ resource: req.body.id })
    res.success({
        result:
        {
            resources: { deletedCount: result.deletedCount },
            reviews: { deletedCount: reviews.deletedCount },
            versions: { deletedCount: versions.deletedCount }
        }
    })
})


export default resourceRouter;