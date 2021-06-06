import { Resource } from "./Resource";
import { Role } from "./Role";

export interface User {
  _id: string;
  // team: Team["_id"];
  username: string;
  hasIcon: boolean;
  role: Role;
  email: string;
  // this is a hash, not the actual password.
  password: string;
  purchases: Resource["_id"][];
}

export interface Seller {
  _id: string;
  user: User["_id"];
  stripe_account: string;
}

// User type frontend.
export interface FUser {
  _id: string;
  username: string;
  hasIcon: boolean;
}

export interface PersonalUser {
  _id: string;
  username: string;
  discordServerId: number | undefined;
  hasIcon: boolean;
  purchases: Resource["_id"][];
  role: Role;
}

export interface UserStats {
  downloads: number;
  resourceCount: number;
  avgReviewScore: number;
}
