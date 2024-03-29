import { Download, Resource, User, Version } from "@savagelabs/types";
import express, { NextFunction, Request, Response } from "express";
import { param } from "express-validator";
import shortid from "shortid";
import {
  DOWNLOADS_COLLECTION,
  getVersions,
  RESOURCES_COLLECTION,
  VERSIONS_COLLECTION,
} from "../../constants";
import { AuthenticateWithBypass, Authorize, FetchTeam } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { bunny, getDatabase } from "../../server";
import { canUseResource } from "../../util";

const directoryVersionRouter = express.Router();

directoryVersionRouter.get(
  "/resource/:resource/:page",
  [
    param("resource").custom((id) => shortid.isValid(id)),
    param("page")
      .isInt()
      .bail()
      .toInt()
      .custom((v) => v > 0)
      .bail(),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const page = Number.parseInt(req.params.page!!);
    const versions = await pageSearchVersionsWithFilter(
      { resource: req.params.resource },
      page
    );
    res.success({ versions });
  }
);

directoryVersionRouter.get(
  "/download/:version",
  [
    param("version").custom((id) => shortid.isValid(id)),
    isValidBody,
    AuthenticateWithBypass,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const versionId = req.params.version as string;

    const version = await getVersions().findOne({ _id: versionId });

    if (!version) {
      res.failure("version not found.");
      return;
    }

    const resource = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .findOne({ _id: version.resource });

    if (!resource) {
      res.failure("resource not found.");
      return;
    }

    if (resource.price !== 0 ) {
      await Authorize(req, res, next);
      await FetchTeam(req, res, next);
      if (!req.user) {
        res.failure("You must be logged in to download premium resources.");
        return;
      }
      if (!req.user!!.purchases.includes(resource?._id) 
      && !canUseResource(resource, req.team.getAllTeams())) {
        res.failure("You do not own this resource.");
        return;
      }
    }
    

    try {
      const file = await bunny.getVersionFile(resource, version);

      console.log(file.data)
      res.send(file.data)
      bumpDownloadCounter(req.user!!, resource, version);
    } catch (err: any) {
      res.failure(err.response.data.Message);
    }
  }
);

const bumpDownloadCounter = async (
  user: User,
  resource: Resource,
  version: Version
) => {
  const downloads_for_user_on_this_version = await getDatabase()
    .collection<Download>(DOWNLOADS_COLLECTION)
    .find({ user: user._id, version: version._id })
    .toArray();

  if (downloads_for_user_on_this_version.length === 0) {
    // no downloads by this user on this version, we can bump download counter.
    await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .updateOne({ _id: resource._id }, { $inc: { downloads: 1 } });
  }

  // insert download for this version into database.
  await getDatabase().collection<Download>(DOWNLOADS_COLLECTION).insertOne({
    _id: shortid.generate(),
    user: user._id,
    version: version._id,
  });
};

const pageSearchVersionsWithFilter = async (filter: object, page: number) => {
  const limit = 5;
  return await getDatabase()
    .collection(VERSIONS_COLLECTION)
    .find(filter)
    .sort({ timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();
};

export default directoryVersionRouter;
