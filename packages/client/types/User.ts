export interface User {
    // _id: string,
    username: string,
    discordServerId: number | undefined
    // role: Role,
    // email: string,
    // this is a hash, not the actual password.
    // password: string
}

export enum Role {
    USER, MODERATOR, ADMIN
}