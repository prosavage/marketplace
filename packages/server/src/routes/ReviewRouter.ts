import { Version, Role, Review } from "@savagelabs/types";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import shortid from "shortid";
import {
  RESOURCES_COLLECTION,
  REVIEWS_COLLECTION,
  VERSIONS_COLLECTION,
  getResources,
  getReviews,
} from "../constants";
import { updateResourceRating } from "../database";
import { Authorize, FetchTeam } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { getDatabase } from "../server";
import { canUseResource } from "../util";

const reviewRouter = express.Router();

reviewRouter.put(
  "/",
  [
    body("message").isString().bail().isLength({ min: 50, max: 500 }),
    body("rating").isInt().bail().toInt(),
    body(["resource"]).custom((id) => shortid.isValid(id)),
    Authorize,
    isValidBody,
    FetchTeam
  ],
  async (req: Request, res: Response) => {
    const body = req.body;

    const latestVersion = (
      await getDatabase()
        .collection<Version>(VERSIONS_COLLECTION)
        .find({ resource: body.resource })
        .sort({ timestamp: -1 })
        .limit(1)
        .toArray()
    )[0];

    if (!latestVersion) {
      res.failure("No version found on the resource");
      return;
    }
    const reviews = await getDatabase()
      .collection<Review>(REVIEWS_COLLECTION)
      .find({
        resource: body.resource,
        author: req.user!!._id,
        version: latestVersion._id,
      })
      .toArray();

    if (reviews != null && reviews.length != 0) {
      res.failure("You have already reviewed this version");
      return;
    }

    const resource = await getResources()
      .findOne({ _id: body.resource });


    if (resource !== null && canUseResource(resource, req.team.getAllTeams())) {
      res.failure("You cannot review your own resource!");
      return;
    }

    const review = {
      _id: shortid.generate(),
      author: req.user!!._id,
      message: body.message,
      rating: body.rating,
      timestamp: new Date(),
      version: latestVersion._id,
      resource: body.resource,
    };
    await getReviews().insertOne(review);
    await getDatabase()
      .collection(RESOURCES_COLLECTION)
      .updateOne({ _id: body.resource }, { $inc: { reviewCount: 1 } });
    // update resource rating - ignore await for this as it's just a background task.
    updateResourceRating(body.resource);
    res.success({ review });
  }
);

reviewRouter.get(
  "/:id",
  [param("id").custom((id) => shortid.isValid(id)), isValidBody],
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const reviews = await getReviews()
      .find({ _id: id })
      .toArray();
    res.success(reviews);
  }
);

reviewRouter.delete(
  "/:id",
  [param("id").custom((id) => shortid.isValid(id)), Authorize, isValidBody],
  async (req: Request, res: Response) => {
    const user = req.user!!;
    const reviewId = req.params.id as string;

    // permission check logic.
    if (user.role < Role.ADMIN) {
      const review = await getDatabase()
        .collection<Version>(REVIEWS_COLLECTION)
        .findOne({ _id: reviewId });
      if (review?.author !== user._id) {
        res.failure("You do not have permission to delete this review.");
        return;
      }
    }

    const result = await getReviews()
      .findOneAndDelete({ _id: reviewId });

    
    // update resource rating - ignore await for this as it's just a background task.
    // Only update resource ratings if the findOneAndDelete finds a review.
    if (result !== null && result.resource) {
      await getResources()
        .updateOne(
          { _id: result.resource },
          { $inc: { reviewCount: -1 } }
        );
      updateResourceRating(result.resource);
    }
    res.success({ result });
  }
);

export default reviewRouter;
