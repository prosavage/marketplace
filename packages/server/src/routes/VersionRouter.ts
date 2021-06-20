import { Resource, Review, Role, Team, Version } from "@savagelabs/types";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import shortid from "shortid";
import {
  RESOURCES_COLLECTION,
  REVIEWS_COLLECTION,
  VERSIONS_COLLECTION,
} from "../constants";
import {
  Authorize,
  FetchTeam,
  hasPermissionForResource,
} from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { bunny, getDatabase } from "../server";
import {sendUpdate} from "../struct/WebhookUtil";

const versionRouter = express.Router();

versionRouter.put(
  "/",
  [
    body(["title", "version"]).isString().bail().isLength({ min: 2, max: 30 }),
    body(["description"]).isString().bail().isLength({ min: 4 }),
    body(["isDev"]).isBoolean(),
    body("resource").custom((id) => shortid.isValid(id)),
    Authorize,
    FetchTeam,
    hasPermissionForResource("resource", Role.ADMIN),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const body = req.body;

    // rate limit code.
    const lastVersion = (
      await getDatabase()
        .collection<Version>(VERSIONS_COLLECTION)
        .find({ resource: body.resource })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray()
    )[0];

    if (lastVersion) {
      const now = new Date();
      const lastUpdated = lastVersion.timestamp;
      // gets diff in seconds, rounded down.
      const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
      const TEN_MIN = 60 * 10;
      if (diff < TEN_MIN && req.user!.role === Role.USER) {
        res.failure(
          "You updated the resource in the ten minutes, please wait."
        );
        return;
      }
    }

    const version: Version = {
      _id: shortid.generate(),
      title: body.title,
      description: body.description,
      fileName: "",
      version: body.version,
      timestamp: new Date(),
      resource: body.resource,
      author: req.user!!._id,
      isDev: body.isDev,
    };

    await getDatabase().collection(VERSIONS_COLLECTION).insertOne(version);
    res.success({ version });
  }
);

versionRouter.put(
  "/:id",
  [param("id").custom((id) => shortid.isValid(id)), Authorize, FetchTeam, isValidBody],
  async (req: Request, res: Response) => {
    const id = req.params.id as string;

    const version = await getDatabase()
      .collection<Version>(VERSIONS_COLLECTION)
      .findOne({ _id: id });
    if (!version) {
      res.failure("version not found.");
      return;
    }

    const resource = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .findOne({ _id: version.resource });
    if (!resource) {
      res.failure("resource not found");
      return;
    }

    try {
      const versionFile = await bunny.getVersionFile(resource, version);
      if (versionFile.data) {
        res.failure("already uploaded.");
        return;
      }
    } catch (err) {
      if (err.response.status !== 404) {
        res.failure("something went wrong" + err.response.statusText);
        return;
      }
    }

    if (req.user!!.role !== Role.USER
      &&
        req.team.owned?._id !== resource.owner && !req.team.memberOf.map((t: Team) => t._id).includes(resource.owner)
      ) {
        res.failure(
          "You do not have permission to access this resource."
        );
        return;
      }

    if (!req.files || !req.files!!.resource) {
      res.failure("invalid body was sent.");
      return;
    }

    const file = req.files!!.resource as any;

    const result = await bunny.putVersionFile(resource, version, file.data);
    getDatabase()
      .collection(VERSIONS_COLLECTION)
      .updateOne({ _id: version._id }, { $set: { fileName: file.name } });
    // update timestamp for the resource. ( this will bump the resource on our listing. )
    getDatabase()
      .collection(RESOURCES_COLLECTION)
      .updateOne({ _id: resource._id }, { $set: { updated: new Date() } });

    sendUpdate(version, resource, req.user);
    res.success({ result: result.data });
  }
);

versionRouter.get(
  "/:id",
  [param("id").custom((id) => shortid.isValid(id)), isValidBody],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const version = await getDatabase()
      .collection(VERSIONS_COLLECTION)
      .findOne({ _id: id });
    res.success(version);
  }
);

versionRouter.delete(
  "/",
  [body("id").custom((id) => shortid.isValid(id)), Authorize, isValidBody],
  async (req: Request, res: Response) => {
    const user = req.user!!;
    const versionId = req.body.id;
    const version = await getDatabase()
      .collection<Version>(VERSIONS_COLLECTION)
      .findOne({ _id: versionId });
    if (!version) {
      res.failure("This version does not exist.");
      return;
    }
    // permission check logic.
    if (user.role < Role.ADMIN && version?.author !== user._id) {
      res.failure("You do not have permission to delete this version.");
      return;
    }
    const results = await getDatabase()
      .collection<Version>(VERSIONS_COLLECTION)
      .deleteOne({ _id: versionId });
    // if we find one, then delete reviews for that version.
    const reviews = await getDatabase()
      .collection<Review>(REVIEWS_COLLECTION)
      .deleteMany({ version: versionId });
    res.success({
      result: {
        deletedVersion: results?.deletedCount,
        reviewsDeleted: reviews?.deletedCount,
      },
    });
  }
);

export default versionRouter;
