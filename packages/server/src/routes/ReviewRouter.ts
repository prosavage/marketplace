import express, {Request, Response} from "express";
import {body, param} from "express-validator";

import shortid from "shortid";
import {RESOURCES_COLLECTION, REVIEWS_COLLECTION, VERSIONS_COLLECTION,} from "../constants";
import {updateResourceRating} from "../database";
import {Authorize} from "../middleware/Authenticate";
import {isValidBody} from "../middleware/BodyValidate";
import {getDatabase} from "../server";
import {Role} from "../struct/Role";
import {Review} from "../types/Review";
import {Version} from "../types/Version";
import {reviewWebhook} from "../webhooks";

const reviewRouter = express.Router();

reviewRouter.put(
    "/",
    [
        body("message").isString().bail().isLength({min: 50, max: 500}),
        body("rating").isInt().bail().toInt(),
        body(["resource"]).custom((id) => shortid.isValid(id)),
        Authorize,
        isValidBody,
    ],
    async (req: Request, res: Response) => {
        const body = req.body;

        const latestVersion = (
            await getDatabase()
                .collection<Version>(VERSIONS_COLLECTION)
                .find({resource: body.resource})
                .sort({timestamp: -1})
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

        const resource = await getDatabase()
            .collection(RESOURCES_COLLECTION)
            .findOne({_id: body.resource});


        if (resource.owner === req.user?._id) {
            res.failure("You cannot review your own resource!")
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
        await getDatabase().collection(REVIEWS_COLLECTION).insertOne(review);
        await getDatabase()
            .collection(RESOURCES_COLLECTION)
            .updateOne({_id: body.resource}, {$inc: {reviewCount: 1}});
        // update resource rating - ignore await for this as it's just a background task.
        updateResourceRating(body.resource);

		reviewWebhook(req, review, resource)

        res.success({review});
    }
);

reviewRouter.get(
    "/:id",
    [param("id").custom((id) => shortid.isValid(id)), isValidBody],
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const reviews = await getDatabase()
            .collection(REVIEWS_COLLECTION)
            .find({_id: id})
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
                .findOne({_id: reviewId});
            if (review?.author !== user._id) {
                res.failure("You do not have permission to delete this review.");
                return;
            }
        }

        const result = await getDatabase()
            .collection(REVIEWS_COLLECTION)
            .findOneAndDelete({_id: reviewId});

        // update resource rating - ignore await for this as it's just a background task.
        // Only update resource ratings if the findOneAndDelete finds a review.
        if (result.value) {
            await getDatabase()
                .collection(RESOURCES_COLLECTION)
                .updateOne(
                    {_id: result.value!!.resource},
                    {$inc: {reviewCount: -1}}
                );
            updateResourceRating(result.value!!.resource);
        }
        res.success({result});
    }
);

export default reviewRouter;
