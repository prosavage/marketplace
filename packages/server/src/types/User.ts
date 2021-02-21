
import { Role } from "../struct/Role";

export interface User {
    _id: string,
    username: string,
    discordServerId: number | undefined,
    hasIcon: boolean,
    role: Role,
    email: string,
    // this is a hash, not the actual password.
    password: string
}

export interface Seller {
    _id: string,
    user: User["_id"],
    stripe_account: string
}