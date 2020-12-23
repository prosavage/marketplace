import { ObjectId } from "mongodb"
import {ResourceType} from "./Resource"

export interface Category {
    _id: ObjectId,
    type: ResourceType,
    name: string
}