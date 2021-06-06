import { Category } from "./Category";
import { Review } from "./Review";
import {Team} from "./Team";

export enum ResourceType {
  PLUGIN = "plugin",
  MOD = "mod",
  SOFTWARE = "software",
}

export interface Resource {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  hasIcon: boolean;
  rating: number;
  category: Category["_id"];
  thread: string;
  owner: Team["_id"];
  updated: Date;
  type: ResourceType;
  downloads: number;
  reviewCount: number;
}

export interface DirectoryResource {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  hasIcon: boolean;
  rating: number;
  category: Category["_id"];
  thread: string;
  owner: Team;
  updated: Date;
  type: ResourceType;
  downloads: number;
  reviews: Review[];
  reviewCount: number;
}
