import { Request, Response, NextFunction } from "express"
import { ObjectId } from "mongodb";
import { RESOURCES_COLLECTION, USERS_COLLECTION } from "../constants";
import { getDatabase, tokenMap } from "../server";
import { Role } from "../struct/Role";
import { Resource } from "../types/Resource";

export const Authorize = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        res.failure("Not logged in.")
        return;
    }
    const userId = tokenMap.get(token);
    if (!userId) {
        res.failure("Invalid token.")
        return;
    }

    const user = await getDatabase().collection(USERS_COLLECTION).findOne({ _id: userId })
    if (!user) {
        res.failure("User was not found.")
        return;
    }

    req.user = user;
    next();
}

export function atleastRole(role: Role) {
    return function (req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            res.failure("Not logged in", 401)
            return;
        }
        const userRole = req.user.role;
        if (role > userRole) {
            res.failure(`No permission role: ${Role[userRole]} required: ${Role[role]}`, 401)
            return;
        }
        next();
    }
}

export function hasPermissionForResource(pathToResourceId: string, bypassRole: Role) {
    return async function (req: Request, res: Response, next: NextFunction) {
        let resourceId = req.body[pathToResourceId]
        if (!resourceId) {
            resourceId = req.params[pathToResourceId]
        }
        if (!resourceId) {
            res.failure("Resource ID path does not exist, hence, permission access cannot be checked");
            return;
        }
        let resourceObjectId: ObjectId;
        if (typeof resourceId === "string") {
            resourceObjectId = new ObjectId(resourceId);
        } else {
            resourceObjectId = resourceId;
        }
        if (!req.user) {
            res.failure("not logged in", 401);
            return;
        }

        const userRole = req.user.role;
        // if they have the bypass role, they can just be approved.
        if (bypassRole <= userRole) {
            next();
            return;
        }

        const resource = await getDatabase().collection<Resource>(RESOURCES_COLLECTION).findOne({ _id: resourceObjectId });
        if (!resource) {
            res.failure("Resource does not exist, hence, permission to access cannot be checked.")
            return;
        }

        if (!req.user._id.equals(resource.owner)) {
            res.failure("You do not have permission to access this resource.");
            return;
        }

        next();
    }


}