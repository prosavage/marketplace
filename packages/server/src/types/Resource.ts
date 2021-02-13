
import { Category } from "./Category";
import { User } from "./User";

export enum ResourceType {
    PLUGIN = "plugin", MOD = "mod", SOFTWARE = "software"
}


export interface Resource {
    _id: string,
    name: string,
    description: string,
    price: number,
    hasIcon: boolean,
    rating: number,
    category: Category["_id"],
    thread: string,
    owner: User["_id"],
    updated: Date,
    type: ResourceType,
    downloads: number,
    reviewCount: number
}

