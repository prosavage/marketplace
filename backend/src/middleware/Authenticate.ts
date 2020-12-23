import { Request, Response, NextFunction } from "express"
import { USERS_COLLECTION } from "../constants";
import { getDatabase, tokenMap } from "../server";
import { Role } from "../struct/Role";

export const Authorize = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(400).json({ error: "Not logged in." })
        return;
    }
    const userId = tokenMap.get(token);
    if (!userId) {
        res.status(400).json({ error: "Invalid token." })
        return;
    }

    const user = await getDatabase().collection(USERS_COLLECTION).findOne({ _id: userId })
    if (!user) {
        res.status(400).json({ error: "User was not found." })
        return;
    }

    req.user = user;
    next();
}

export function atleastRole(role: Role) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            res.status(401).json({ error: "Not logged in", })
            return;
        }
        const userRole = req.user.role;
        if (role > userRole) {
            res.status(401).json({ error: "No permission", role: Role[userRole], required: Role[role]})
            return;
        }
        next();
    }
}