import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { REVIEWS_COLLECTION, VERSIONS_COLLECTION } from "../constants";
import { updateResourceRating } from "../database";
import { Authorize } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { getDatabase } from "../server";
import { Role } from "../struct/Role";
import { Review } from "../types/Review";
import { Version } from "../types/Version";

const reviewRouter = express.Router();

reviewRouter.put("/", [
    body("message").isString(),
    body("rating").isInt().bail().toInt(),
    body(["resource"]).isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const body = req.body;

    const latestVersion = (await getDatabase().collection<Version>(VERSIONS_COLLECTION)
        .find({ resource: body.resource })
        .sort({ timestamp: -1 })
        .limit(1).toArray())[0];

    if (!latestVersion) {
        res.failure("No version found on the resource")
        return;
    }
    const reviews = await getDatabase().collection<Review>(REVIEWS_COLLECTION)
        .find({ resource: body.resource, author: req.user!!._id, version: latestVersion._id })
        .toArray();

    if (reviews != null && reviews.length != 0) {
        res.failure("You have already reviewed this version");
        return;
    }

    const review = {
        author: req.user!!._id,
        message: body.message,
        rating: body.rating,
        timestamp: new Date(),
        version: latestVersion._id,
        resource: body.resource,
    };
    await getDatabase().collection(REVIEWS_COLLECTION).insertOne(review);

    // update resource rating - ignore await for this as it's just a background task.
    updateResourceRating(body.resource);
    res.success({ review })
})

reviewRouter.get("/:id", [
    param("id").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    isValidBody
], async (req: Request, res: Response) => {
    const id = req.params.id;
    const reviews = await getDatabase().collection(REVIEWS_COLLECTION).find({ _id: id }).toArray();
    res.success(reviews)
})

reviewRouter.delete("/", [
    body("id").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    Authorize,
    isValidBody
], async (req: Request, res: Response) => {
    const user = req.user!!;
    const reviewId = req.body.id

    // permission check logic.
    if (user.role < Role.ADMIN) {
        const review = await getDatabase()
            .collection<Version>(REVIEWS_COLLECTION)
            .findOne({ _id: reviewId });
        if (!review?.author.equals(user._id)) {
            res.failure("You do not have permission to delete this review.");
            return;
        }
    }

    const result = await getDatabase()
        .collection(REVIEWS_COLLECTION)
        .findOneAndDelete({ _id: reviewId });

    // update resource rating - ignore await for this as it's just a background task.
    // Only update resource ratings if the findOneAndDelete finds a review.
    if (result.value) {
        updateResourceRating(result.value!!.resource);
    }
    res.success({ result });
})



export default reviewRouter;