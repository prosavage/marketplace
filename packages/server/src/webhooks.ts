import {Request} from "express";
import {getDatabase} from "./server";
import Webhook from "./types/Webhook";
import {RESOURCES_COLLECTION, WEBHOOKS_COLLECTION} from "./constants";
import axios from "axios";
import {Review} from "./types/Review";
import {Resource} from "./types/Resource";
import {Version} from "./types/Version";

export const reviewWebhook = async (
	req: Request, review: Review, resource: Resource) => {
	const webhooks = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).find({resource: resource._id, events: "review"}).toArray()
	const userwebhooks = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).find({resource: undefined, user: resource.owner, events: "review"}).toArray()

	let user_profile_picture;
	if(req.user!!.hasIcon) {
		user_profile_picture = `https://marketplace-savagelabs.b-cdn.net/users/${req.user!!._id}/icon.png`
	} else {
		user_profile_picture = "https://marketplace-savagelabs.b-cdn.net/defaults/default-user.png"
	}

	for (const webhook of webhooks) {
		axios.post(webhook.url, {
			username: "SavageLabs Marketplace",
			avatar_url: "https://marketplace-savagelabs.b-cdn.net/defaults/savagelabs-icon.png",
			embeds: [{
				author: {
					name: req.user!!.username,
					icon_url: user_profile_picture,
				},
				title: resource.name + " - New Review",
				description: review.message,
				fields: [
					{
						name: "Rating",
						value: req.body.rating,
						inline: false
					}
				]
			}]}).then(_res => {
			getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).updateOne({_id: webhook._id},{$set: {
				last_called: new Date()
				}})
		}).catch(err=>console.log(err.response.data))
	}
	for (const webhook of userwebhooks) {
		axios.post(webhook.url, {
			username: "SavageLabs Marketplace",
			avatar_url: "https://marketplace-savagelabs.b-cdn.net/defaults/savagelabs-icon.png",
			embeds: [{
				author: {
					name: req.user!!.username,
					icon_url: user_profile_picture,
				},
				title: resource.name + " - New Review",
				description: review.message,
				fields: [
					{
						name: "Rating",
						value: req.body.rating,
						inline: false
					}
				]
			}]}).catch(err=>console.log(err.response.data))
	}
}


export const versionWebhook = async (
	req: Request, version: Version, resource_id: string) => {

	const resource = await getDatabase().collection<Resource>(RESOURCES_COLLECTION).findOne({_id: resource_id})

	if (!resource) {
		console.log("No resource found!")
	}

	const webhooks = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).find({resource: resource!!._id, events: "version-update"}).toArray()
	const userwebhooks = await getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).find({resource: undefined, user: resource!!.owner, events: "version-update"}).toArray()

	let user_profile_picture;
	if(req.user!!.hasIcon) {
		user_profile_picture = `https://marketplace-savagelabs.b-cdn.net/users/${req.user!!._id}/icon.png`
	} else {
		user_profile_picture = "https://marketplace-savagelabs.b-cdn.net/defaults/default-user.png"
	}

	for (const webhook of webhooks) {
		axios.post(webhook.url, {
			username: "SavageLabs Marketplace",
			avatar_url: "https://marketplace-savagelabs.b-cdn.net/defaults/savagelabs-icon.png",
			embeds: [{
				author: {
					name: req.user!!.username,
					icon_url: user_profile_picture,
				},
				title: resource!!.name + " - New Version Released",
				fields: [
					{
						name: version.title,
						value: version.description,
						inline: false
					}
				]
			}]}).then(_res => {
			getDatabase().collection<Webhook>(WEBHOOKS_COLLECTION).updateOne({_id: webhook._id},{$set: {
					last_called: new Date()
				}})
		}).catch(err=>console.log(err.response.data))
	}
	for (const webhook of userwebhooks) {
		axios.post(webhook.url, {
			username: "SavageLabs Marketplace",
			avatar_url: "https://marketplace-savagelabs.b-cdn.net/defaults/savagelabs-icon.png",
			embeds: [{
				author: {
					name: req.user!!.username,
					icon_url: user_profile_picture,
				},
				title: resource!!.name + " - New Version Released",
				fields: [
					{
						name: version.title,
						value: version.description,
						inline: false
					}
				]
			}]}).catch(err=>console.log(err.response.data))
	}
}
