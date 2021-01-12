import express, { Request, Response } from "express";
import { param } from "express-validator";
import { ObjectId } from "mongodb";
import {
  CATEGORIES_COLLECTION,
  RESOURCES_COLLECTION,
  USERS_COLLECTION,
} from "../../constants";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { Category } from "../../types/Category";
import { Resource, ResourceType } from "../../types/Resource";
import { User } from "../../types/User";
import directoryResourceRouter from "./DirectoryResourceRouter";
import directoryVersionRouter from "./DirectoryVersionRouter";

const directoryRouter = express.Router();

directoryRouter.use("/resources", directoryResourceRouter);
directoryRouter.use("/versions", directoryVersionRouter);

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
  "/user/:id",
  [
    param("id")
      .isMongoId()
      .bail()
      .customSanitizer((v) => new ObjectId(v)),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const user = await getDatabase()
      .collection<User>(USERS_COLLECTION)
      .findOne({ _id: (req.params.id as unknown) as ObjectId });

    if (user === null) {
      res.failure("user not found");
      return;
    }

    res.success({
      user: {
        _id: user?._id.toHexString(),
        username: user?.username,
        discordServerId: user?.discordServerId,
        hasIcon: user?.hasIcon,
      },
    });
  }
);

directoryRouter.get(
  "/user-stats/:id",
  [
    param("id")
      .isMongoId()
      .bail()
      .customSanitizer((v) => new ObjectId(v)),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const user = await getDatabase()
      .collection<User>(USERS_COLLECTION)
      .findOne({ _id: (req.params.id as unknown) as ObjectId });

    if (user === null) {
      res.failure("user not found");
      return;
    }

    const resources = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .find({ owner: user._id })
      .toArray();

    const downloads = resources.length > 0 ? resources
      .map((it) => it.downloads)
      .reduce(
        (accumulatedDownloads, current) => accumulatedDownloads + current
      ) : 0;

    const resourceCount = resources.length;

    const avgReview = resources.length > 0 ?
      resources
        .map((it) => it.rating)
        .reduce((total, current) => total + current) / resourceCount : 0

    res.success({
      stats: {
        downloads,
        resourceCount,
        avgReviewScore: avgReview
      },
    });
  }
);

export default directoryRouter;
