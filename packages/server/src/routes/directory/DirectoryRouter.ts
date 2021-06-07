import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import shortid from "shortid";
import {
    CATEGORIES_COLLECTION,
    RESOURCES_COLLECTION,
    REVIEWS_COLLECTION, TEAMS_COLLECTION,
    USERS_COLLECTION,
} from "../../constants";
import { Authorize } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { Category, Resource, ResourceType, User } from "@savagelabs/types";
import directoryResourceRouter from "./DirectoryResourceRouter";
import directoryUserRouter from "./DirectoryUserRouter";
import directoryVersionRouter from "./DirectoryVersionRouter";
import directoryTeamRouter from "./DirectoryTeamRouter";
import directoryTeamInvite from "./DirectoryTeamInvite";

const directoryRouter = express.Router();

directoryRouter.use("/resources", directoryResourceRouter);
directoryRouter.use("/versions", directoryVersionRouter);
directoryRouter.use("/user", directoryUserRouter);
directoryRouter.use("/team", directoryTeamRouter);
directoryRouter.use("/invite", directoryTeamInvite);

directoryRouter.get(
  "/reviews/:resource",
  [param("resource").custom((id) => shortid.isValid(id)), isValidBody],
  async (req: Request, res: Response) => {
    const resourceId = req.params.resource as string;
    if (!resourceId || resourceId === null) {
      res.failure("invalid resource id");
      return;
    }

    const reviews = await getDatabase()
      .collection(REVIEWS_COLLECTION)
      .find({ resource: resourceId })
      .toArray();

    res.success({ reviews });
  }
);

directoryRouter.get("/featured", async (_req: Request, res: Response) => {
  // static values for now...
  const featuredResource: string[] = [
    "l72MC9B8X",
    "g_M72m3FS",
  ];

  const resources = await Promise.all(
    featuredResource.map((resourceId) => {
      return getDatabase()
        .collection<Resource>(RESOURCES_COLLECTION)
        .aggregate([
          { $match: { _id: resourceId } },
          {
            $lookup: {
              from: TEAMS_COLLECTION,
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          { $unwind: "$owner" },
          {
            $unset: [
              "owner.email",
              "owner.role",
              "owner.password",
              "owner.purchases",
            ],
          },
        ])
        .toArray();
    })
  );
  // flatten the array; since its an array of arrays lol.
  const flatArray = Array.prototype.concat.apply([], resources);
  res.success({ resources: flatArray });
});

directoryRouter.post(
  "/sitemap-info",
  [body("system-password").isString(), isValidBody],
  async (req: Request, res: Response) => {
    const password = req.body["system-password"];
    if (password !== process.env.SYSTEM_PASSWORD) {
      res.failure("incorrect system password.");
      return;
    }

    const resources = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .find()
      .toArray();
    const users = await getDatabase()
      .collection<User>(USERS_COLLECTION)
      .find()
      .toArray();

    res.success({ users, resources });
  }
);

directoryRouter.get(
  "/categories/:type",
  [param("type").isString(), isValidBody],
  async (req: Request, res: Response) => {
    const pluginType = req.params.type as ResourceType;
    if (!pluginType) {
      res.failure("invalid plugin type.");
      return;
    }

    const categories = await getDatabase()
      .collection<Category>(CATEGORIES_COLLECTION)
      .find({ type: pluginType })
      .toArray();
    res.success({ categories });
  }
);

directoryRouter.get(
  "/my-resources",
  [Authorize, isValidBody],
  async (req: Request, res: Response) => {
    const user = req.user!!;

    const myResources = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .find({ owner: user._id })
      .toArray();

    res.success({ resources: myResources });
  }
);

directoryRouter.get(
  "/user-stats/:id",
  [param("id").custom((id) => shortid.isValid(id)), isValidBody],
  async (req: Request, res: Response) => {
    const user = await getDatabase()
      .collection<User>(USERS_COLLECTION)
      .findOne({ _id: req.params.id as string });

    if (user === null) {
      res.failure("user not found");
      return;
    }

    const resources = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .find({ owner: user._id })
      .toArray();

    const downloads =
      resources.length > 0
        ? resources
            .map((it) => it.downloads)
            .reduce(
              (accumulatedDownloads, current) => accumulatedDownloads + current
            )
        : 0;

    const resourceCount = resources.length;

    const avgReview =
      resources.length > 0
        ? resources
            .map((it) => it.rating)
            .reduce((total, current) => total + current) / resourceCount
        : 0;

    res.success({
      stats: {
        downloads,
        resourceCount,
        avgReviewScore: avgReview,
      },
    });
  }
);

export default directoryRouter;
