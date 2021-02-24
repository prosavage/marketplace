import express, { Request, Response } from "express";
import { param } from "express-validator";

import shortid from "shortid";
import {
  CATEGORIES_COLLECTION,
  RESOURCES_COLLECTION,
  REVIEWS_COLLECTION,
  USERS_COLLECTION,
} from "../../constants";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { ResourceType } from "../../types/Resource";

const directoryResourceRouter = express.Router();

directoryResourceRouter.get(
  "/page/:page",
  [
    param("page")
      .isInt()
      .bail()
      .toInt()
      .custom((v) => v > 0)
      .bail(),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const page: number = Number.parseInt(req.params.page!!);
    const resources = await pageSearchResourcesWithFilter({}, page);
    res.success({ resources });
  }
);

directoryResourceRouter.get(
  "/category/:type/:category/:page",
  [
    param("type").isString(),
    param("category").isString(),
    param("page")
      .isInt()
      .bail()
      .toInt()
      .custom((v) => v > 0)
      .bail(),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const categoryName = req.params.category;
    const categoryFromDb = await getDatabase()
      .collection(CATEGORIES_COLLECTION)
      .findOne({ name: categoryName, type: req.params.type });
    const page: number = Number.parseInt(req.params.page!!);
    if (page <= 0) {
      res.failure("negative page");
      return;
    }
    let filter = {};
    if (categoryFromDb != null) {
      filter = { category: categoryFromDb._id };
    }
    const resources = await pageSearchResourcesWithFilter(filter, page);
    res.success({ category: categoryFromDb, resources });
  }
);

directoryResourceRouter.get(
  "/type/:type/:page",
  [
    param("type").isString(),
    param("page")
      .isInt()
      .bail()
      .toInt()
      .custom((v) => v > 0)
      .bail(),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const page: number = Number.parseInt(req.params.page!!);
    if (page <= 0) {
      res.failure("negative page");
      return;
    }
    let filter = {};
    const type = req.params.type as ResourceType;
    if (type) filter = { type };
    const resources = await pageSearchResourcesWithFilter(filter, page);

    res.success({ type, resources });
  }
);

directoryResourceRouter.get(
  "/author/:user/:page",
  [
    param("user")
      .custom(id => shortid.isValid(id))
      ,
    param("page")
      .isInt()
      .bail()
      .toInt()
      .custom((v) => v > 0)
      .bail(),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const userId = req.params.user;
    const page: number = Number.parseInt(req.params.page!!);
    const resources = await pageSearchResourcesWithFilter(
      { owner: userId },
      page
    );
    res.success({ resources });
  }
);

const pageSearchResourcesWithFilter = async (filter: object, page: number) => {
  return await getDatabase()
    .collection(RESOURCES_COLLECTION)
    .aggregate([
      { $match: filter },
      { $sort: { updated: -1 } },
      { $skip: (page - 1) * 10 },
      { $limit: 10 },
      {
        $lookup: {
          from: USERS_COLLECTION,
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $lookup: {
          from: REVIEWS_COLLECTION,
          localField: "_id",
          foreignField: "resource",
          as: "reviews",
        },
      },
      // this is weird because review count is a collection.
      //   {
      //     $lookup: {
      //       from: USERS_COLLECTION,
      //       localField: "reviews.author",
      //       foreignField: "_id",
      //       as: "author",
      //     },
      //   },
      { $unwind: "$owner" },
      { $unset: ["owner.email", "owner.role", "owner.password", "owner.purchases"] },
    ])
    .toArray();
};

export default directoryResourceRouter;
