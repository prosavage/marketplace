import { ObjectId } from "mongodb";
import { Role } from "../struct/Role";

export interface User {
    _id: ObjectId,
    username: string,
    role: Role,
    email: string,
    // this is a hash, not the actual password.
    password: string
}