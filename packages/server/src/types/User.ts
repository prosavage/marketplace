import { Role } from "../struct/Role";
import { Resource } from "./Resource";

export interface User {
  _id: string;
  username: string;
  discordServerId: number | undefined;
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
