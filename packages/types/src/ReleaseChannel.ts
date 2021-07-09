import { Resource } from "./Resource";

export interface ReleaseChannel {
    _id: string;
    name: string;
    description: string;
    resource: Resource["_id"]
}