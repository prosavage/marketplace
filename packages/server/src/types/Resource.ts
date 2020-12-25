import { ObjectId } from "mongodb";
import { Category } from "./Category";
import { User } from "./User";

export enum ResourceType {
    PLUGIN = "plugin", MOD = "mod", SOFTWARE = "software"
}


export interface Resource {
    _id: ObjectId,
    name: string,
    price: number,
    category: Category["_id"],
    thread: string,
    owner: User["_id"],
    ratings: Rating[],
    updated: Date,
    type: ResourceType
}

export interface Rating {
    user: User["_id"],
    message: string,
    rating: number
}

