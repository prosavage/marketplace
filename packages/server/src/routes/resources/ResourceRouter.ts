import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import {
  CATEGORIES_COLLECTION,
  RESOURCES_COLLECTION,
  REVIEWS_COLLECTION,
  VERSIONS_COLLECTION,
} from "../../constants";
import { atleastRole, Authorize } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { Role } from "../../struct/Role";
import { ResourceType } from "../../types/Resource";
import resourceIconRouter from "./ResourceIconRouter";

const resourceRouter = express.Router();

resourceRouter.use("/icon", resourceIconRouter);

resourceRouter.get(
  "/:id",
  [
    param("id")
      .isMongoId()
      .bail()
      .customSanitizer((value) => new ObjectId(value)),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const resource = await getDatabase()
      .collection(RESOURCES_COLLECTION)
      .findOne({ _id: id });
    res.success({ resource });
  }
);

resourceRouter.put(
  "/",
  [
    body(["name", "thread", "darkThread", "category"]).isString(),
    body("price").isInt(),
    body("type")
      .custom((v) => (v as ResourceType) !== undefined)
      .bail()
      .customSanitizer((v) => v as ResourceType),
    body("category")
      .isMongoId()
      .bail()
      .customSanitizer((value) => new ObjectId(value)),
    body([
      "version.title",
      "version.description",
      "version.version",
    ]).isString(),
    Authorize,
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const resource = req.body;
    resource.version.timestamp = new Date();
    resource.updated = new Date();
    const database = getDatabase();

    const category = await database
      .collection(CATEGORIES_COLLECTION)
      .findOne({ _id: resource.category });

    if (!category) {
      res.failure("invalid category");
      return;
    }

    const resourceToAdd = {
      name: resource.name,
      category: resource.category,
      rating: 0,
      hasIcon: false,
      price: resource.price,
      thread: resource.thread,
      darkThread: resource.darkThread,
      owner: req.user!!._id,
      updated: resource.updated,
      type: resource.type as ResourceType,
      downloads: 0,
    };

    const result = await database
      .collection(RESOURCES_COLLECTION)
      .insertOne(resourceToAdd);
    resource.version._id = new ObjectId(result.ops[0]._id);
    database.collection(VERSIONS_COLLECTION).insertOne(resource.version);

    res.success({ resouce: resourceToAdd });
  }
);

resourceRouter.delete(
  "/",
  [
    body("id")
      .isMongoId()
      .bail()
      .customSanitizer((value) => new ObjectId(value)),
    Authorize,
    atleastRole(Role.MODERATOR),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const result = await getDatabase()
      .collection(RESOURCES_COLLECTION)
      .deleteOne({ _id: req.body.id });
    const reviews = await getDatabase()
      .collection(REVIEWS_COLLECTION)
      .deleteMany({ resource: req.body.id });
    const versions = await getDatabase()
      .collection(VERSIONS_COLLECTION)
      .deleteMany({ resource: req.body.id });
    res.success({
      result: {
        resources: { deletedCount: result.deletedCount },
        reviews: { deletedCount: reviews.deletedCount },
        versions: { deletedCount: versions.deletedCount },
      },
    });
  }
);

export default resourceRouter;
