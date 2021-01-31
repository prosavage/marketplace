import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import {
  CATEGORIES_COLLECTION,
  RESOURCES_COLLECTION,
  REVIEWS_COLLECTION,
  VERSIONS_COLLECTION,
} from "../../constants";
import {
  atleastRole,
  Authorize,
  hasPermissionForResource,
} from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { Role } from "../../struct/Role";
import { Category } from "../../types/Category";
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

resourceRouter.patch(
  "/:id",
  [
    param("id")
      .isMongoId()
      .bail()
      .customSanitizer((v) => new ObjectId(v)),
    body(["name", "description"])
      .isString()
      .bail()
      .isLength({ min: 4, max: 35 }),
    body("thread").isString(),
    Authorize,
    hasPermissionForResource("id", Role.ADMIN),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const resource = await getDatabase()
      .collection(RESOURCES_COLLECTION)
      .findOne({ _id: id });

    if (!resource) {
      res.failure("resource not found.");
      return;
    }

    const transaction = await getDatabase()
      .collection(RESOURCES_COLLECTION)
      .updateOne(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            description: req.body.description,
            thread: req.body.thread,
          },
        }
      );

    res.success({ result: transaction.result });
  }
);

resourceRouter.put(
  "/",
  [
    body(["thread", "category"]).isString(),
    body("name", "description").isString().bail().isLength({ min: 4, max: 35 }),
    body("price").isInt(),
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
      .collection<Category>(CATEGORIES_COLLECTION)
      .findOne({ _id: resource.category });

    if (!category || category === null) {
      res.failure("invalid category");
      return;
    }

    const resourceToAdd = {
      name: resource.name,
      category: resource.category,
      description: resource.description,
      rating: 0,
      hasIcon: false,
      price: resource.price,
      thread: resource.thread,
      owner: req.user!!._id,
      updated: resource.updated,
      type: category.type,
      downloads: 0,
    };

    const result = await database
      .collection(RESOURCES_COLLECTION)
      .insertOne(resourceToAdd);

    resource.version.resource = new ObjectId(result.ops[0]._id);
    database.collection(VERSIONS_COLLECTION).insertOne(resource.version);

    res.success({ resource: resourceToAdd });
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
