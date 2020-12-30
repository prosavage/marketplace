import { ObjectId } from "mongodb";
import { Resource } from "./Resource";
import { User } from "./User";
import { Version } from "./Version";

export interface Review {
    _id: ObjectId,
    author: User["_id"],
    message: string,
    rating: number,
    timestamp: Date,
    version: Version["_id"],
    resource: Resource["_id"]   
}