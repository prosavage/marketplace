import express, {Request, Response} from "express";
import {body, param} from "express-validator";
import shortid from "shortid";
import {isValidBody} from "../middleware/BodyValidate";
import {Authorize} from "../middleware/Authenticate";
import Webhook from "../types/Webhook"
import {WEBHOOKS_COLLECTION} from "../constants";
import {getDatabase} from "../server";

const webhookRouter = express.Router();

webhookRouter.get("/", [Authorize, isValidBody],
	async (req: Request, res: Response) => {
		const webhooks = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).find({user: req.user!!._id}).toArray()

		res.success({webhooks})
	})


webhookRouter.get("/:id", [param("id").custom(v => shortid.isValid(v)), Authorize, isValidBody],
	async (req: Request, res: Response) => {
		const id = req.params.id

		const webhook = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).findOne({_id: id, user: req.user!!._id})

		if(webhook === null) {
			res.failure("webhook not found")
			return
		}

		res.success({webhook})
	})


webhookRouter.put("/", [
		body(["url", "secret"]).isString(),
		body("name", "description").isString().bail().isLength({min: 4, max: 35}),
		body(["active"]).isBoolean(),
		body("events").isArray(),
		Authorize,
		isValidBody],
	async (req: Request, res: Response) => {
		const body = req.body;

		const webhook: Webhook = {
			_id: shortid.generate(),
			url: body.url,
			events: body.events,
			name: body.name,
			secret: body.secret,
			active: body.active,
			user: req.user!!._id,
			last_called: undefined,
		};

		await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).insertOne(webhook);

		res.success({webhook})
})


webhookRouter.delete("/:id", [param("id").custom(v => shortid.isValid(v)), Authorize, isValidBody],
	async (req: Request, res: Response) => {
		const id = req.params.id

		const webhook = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).findOne({_id: id, user: req.user!!._id})

		if(webhook === null) {
			res.failure("webhook not found")
			return
		}

		await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).deleteOne({_id: id})

		res.success({
			result: {
				deletedWebhook: id
			}
		})
	})


webhookRouter.patch("/:id", [
		body(["url", "secret"]).isString(),
		body("name", "description").isString().bail().isLength({min: 4, max: 35}),
		body(["active"]).isBoolean(),
		body("events").isArray(),
		param("id").custom(v => shortid.isValid(v)),
		Authorize,
		isValidBody],
	async (req: Request, res: Response) => {
		const body = req.body;
		const id = req.params.id

		const webhook = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).findOne({_id: id, user: req.user!!._id})

		if(webhook === null) {
			res.failure("webhook not found")
			return
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

		const updatedWebhook = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).findOne({_id: id, user: req.user!!._id})

		res.success({updatedWebhook})
	})


export default webhookRouter;
