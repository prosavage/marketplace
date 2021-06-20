import express, {Request, Response} from "express";
import {body, param} from "express-validator";
import shortid from "shortid";
import {isValidBody} from "../middleware/BodyValidate";
import {Authorize, hasPermissionForResource} from "../middleware/Authenticate";
import {Role, Version, Webhook} from "@savagelabs/types";
import {getResources, getWebhooks, WEBHOOKS_COLLECTION} from "../constants";
import {getDatabase} from "../server";
import {isShortId} from "../util";
import {sendUpdate} from "../struct/WebhookUtil";

const webhookRouter = express.Router();

webhookRouter.get(
    "/:resource",
    [
        param("resource").custom((v) => shortid.isValid(v)),
        Authorize, hasPermissionForResource("resource", Role.MODERATOR),
        isValidBody
    ],
    async (req: Request, res: Response) => {
        const webhook = await getWebhooks().findOne({resource: req.params.resource});

        if (webhook === null) {
            res.failure("webhook not found");
            return;
        }

        res.success({webhook});
    }
);

webhookRouter.put(
    "/",
    [
        body(["resource"]).custom(isShortId),
        body("url").isURL(),
        Authorize,
        isValidBody,
        hasPermissionForResource("resource", Role.MODERATOR),
    ],
    async (req: Request, res: Response) => {
        const body = req.body;

        const webhook: Webhook = {
            _id: shortid.generate(),
            url: body.url,
            resource: body.resource,
        };

        await getWebhooks().insertOne(webhook);

        res.success({webhook});
    }
);

webhookRouter.delete(
    "/:id",
    [
        param("id").custom((v) => shortid.isValid(v)),
        body("resource").custom((v) => shortid.isValid(v)),
        Authorize,
        isValidBody,
        hasPermissionForResource("resource", Role.MODERATOR),
    ],
    async (req: Request, res: Response) => {
        const id = req.params.id;

        const webhook = await getDatabase()
            .collection<Webhook>(WEBHOOKS_COLLECTION)
            .findOne({_id: id});

        if (webhook === null) {
            res.failure("webhook not found");
            return;
        }

        await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).deleteOne({_id: id});

        res.success({
            result: {
                deletedWebhook: id,
            },
        });
    }
);

webhookRouter.get("/:resource/test",
    [param("resource").custom((v) => shortid.isValid(v)),
        isValidBody,
        Authorize,
        hasPermissionForResource("resource", Role.MODERATOR)
    ],
    async (req: Request, res: Response) => {
        const webhook = await getWebhooks().findOne({resource: req.params.resource});
        if (webhook === null) {
            res.failure("webhook wasn't found, so it cannot be tested. Create one first.");
            return;
        }

        const resource = await getResources().findOne({_id: req.params.resource});
        if (resource === null) {
            res.failure("this webhook's resource no longer exists. Deleting...");
            await getWebhooks().deleteOne({_id: webhook._id});
            return;
        }

        const dummyVer: Version = {
            _id: "test-id",
            title: "Test Update",
            resource: req.params.resource!!,
            author: req.user._id,
            description: "A test update.",
            fileName: "test-file.jar",
            isDev: false,
            version: "1.2",
            timestamp: new Date()
        }

        await sendUpdate(dummyVer, resource, req.user);
        res.success({});
    }
)


webhookRouter.patch(
    "/:id",
    [
        body(["url"]).isString(),
        param("resource").custom((v) => shortid.isValid(v)),
        Authorize,
        isValidBody,
    ],
    async (req: Request, res: Response) => {
        const body = req.body;
        const id = req.params.id;

        const webhook = await getDatabase()
            .collection<Webhook>(WEBHOOKS_COLLECTION)
            .findOne({_id: id, user: req.user!!._id});

        if (webhook === null) {
            res.failure("webhook not found");
            return;
        }

        await getDatabase()
            .collection<Webhook>(WEBHOOKS_COLLECTION)
            .updateOne(
                {_id: id},
                {
                    $set: {
                        url: body.url,
                        events: body.events,
                        name: body.name,
                        secret: body.secret,
                        active: body.active,
                    },
                }
            );

        const updatedWebhook = await getDatabase()
            .collection<Webhook>(WEBHOOKS_COLLECTION)
            .findOne({_id: id, user: req.user!!._id});

        res.success({updatedWebhook});
    }
);

export default webhookRouter;
