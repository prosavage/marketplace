import { ObjectId } from "mongodb";
import { getDatabase } from "../server";
import { Resource } from "./Resource";

export interface Version {
    _id: ObjectId
    version: string,
    title: string,
    description: string,
    timestamp: Date,
    resource: Resource["_id"],
    author: ObjectId
}