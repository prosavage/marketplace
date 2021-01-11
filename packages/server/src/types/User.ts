import { ObjectId } from "mongodb";
import { Role } from "../struct/Role";

export interface User {
    _id: ObjectId,
    username: string,
    discordServerId: number | undefined,
    hasIcon: boolean,
    role: Role,
    email: string,
    // this is a hash, not the actual password.
    password: string
}