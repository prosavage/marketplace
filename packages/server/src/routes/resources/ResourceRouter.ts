import { Category, Resource, Role, Version } from "@savagelabs/types";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import shortid from "shortid";
import slugify from "slugify";
import {
  CATEGORIES_COLLECTION,
  RESOURCES_COLLECTION,
  REVIEWS_COLLECTION,
  VERSIONS_COLLECTION,
} from "../../constants";
import {
  atleastRole,
  Authorize,
  FetchTeam,
  hasPermissionForResource,
} from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import resourceIconRouter from "./ResourceIconRouter";

const resourceRouter = express.Router();

resourceRouter.use("/icon", resourceIconRouter);

resourceRouter.get(
  "/:id",
  [param("id").custom((id) => shortid.isValid(id)), isValidBody],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const resource = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .findOne({ _id: id });
    res.success({ resource });
  }
);

resourceRouter.patch(
  "/:id",
  [
    param("id").custom((id) => shortid.isValid(id)),
    body("name").isString().bail().isLength({ min: 4, max: 35 }),
    body("name").isString().bail().isLength({ min: 4, max: 50 }),
    body("thread").isString(),
    Authorize,
    FetchTeam,
    hasPermissionForResource("id", Role.ADMIN),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const resource = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .findOne({ _id: id });

    if (!resource) {
      res.failure("resource not found.");
      return;
    }
    let price = req.body.price;
    if (resource.price === 0 && price) {
      res.failure("cannot turn a free resource to a premium one.");
      return;
    }

    if (!price) {
      price = resource.price;
    }

    // we need to make sure its changing.
    if (price !== resource.price && price > 100) {
      res.failure("Please contact us about prices over $100.00");
      return;
    }

    const transaction = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .updateOne(
        { _id: id },
        {
          $set: {
            name: req.body.name,
            slug: slugify(req.body.name),
            description: req.body.description,
            thread: req.body.thread,
            price,
          },
        }
      );

    res.success({ result: transaction });
  }
);

resourceRouter.put(
  "/",
  [
    body(["thread", "category"]).isString(),
    body(["name"]).isString().bail().isLength({ min: 4, max: 35 }),
    body(["description"]).isString().bail().isLength({ min: 4, max: 50 }),
    body("price").isNumeric(),
    body("category").custom((id) => shortid.isValid(id)),
    body([
      "version.title",
      "version.description",
      "version.version",
    ]).isString(),
    isValidBody,
    Authorize,
    FetchTeam
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

    const resourceId = shortid.generate();


    if (!req.team.owned) {
      res.failure("You do not own a team, and can only post resources as a team owner.");
      return;
    }

    const resourceToAdd: Resource = {
      _id: resourceId,
      name: resource.name,
      slug: slugify(resource.name),
      category: resource.category,
      description: resource.description,
      rating: 0,
      hasIcon: false,
      price: resource.price,
      owner: req.team.owned._id,
      thread: resource.thread,
      updated: resource.updated,
      type: category.type,
      downloads: 0,
      reviewCount: 0,
    };

    await database.collection<Resource>(RESOURCES_COLLECTION).insertOne(resourceToAdd);

    resource.version.resource = resourceId;
    resource.version._id = shortid.generate();
    await database
      .collection<Version>(VERSIONS_COLLECTION)
      .insertOne(resource.version);

    res.success({ resource: resourceToAdd, version: resource.version });
  }
);

resourceRouter.delete(
  "/:id",
  [
    param("id").custom((id) => shortid.isValid(id)),
    Authorize,
    atleastRole(Role.MODERATOR),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .deleteOne({ _id: id });
    const reviews = await getDatabase()
      .collection(REVIEWS_COLLECTION)
      .deleteMany({ resource: id });
    const versions = await getDatabase()
      .collection(VERSIONS_COLLECTION)
      .deleteMany({ resource: id });
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
