import {
  Resource,
  Role,
} from "@savagelabs/types";
import {
  NextFunction,
  Request,
  Response,
} from "express";
import {
  getTeams,
  getUsers,
  RESOURCES_COLLECTION,
} from "../constants";
import {
  getDatabase,
  tokenMap,
} from "../server";
import { canUseResource } from "../util";


export const FetchTeam =
  async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {

    if (!req.user) {
      throw new Error("Authorize middleware needs to be before FetchTeam.");
    }

    const userID = req.user._id;

    const ownedTeam = await getTeams().findOne({ owner: userID })

    if (ownedTeam !== null) {
      req.team.owned = ownedTeam;
    }

    const memberOf = await getTeams().find({ members: { $in: [userID] } }).toArray()

    req.team.memberOf = memberOf;

    next();
  };

export const Authorize =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token =
      req.headers
        .authorization;
    if (!token) {
      res.failure(
        "Not logged in."
      );
      return;
    }
    const userId =
      tokenMap.get(token);
    if (!userId) {
      res.failure(
        "Invalid token."
      );
      return;
    }

    const user =
      await getUsers()
        .findOne({
          _id: userId,
        });
    if (!user) {
      res.failure(
        "User was not found."
      );
      return;
    }


    req.user = user;
    next();
  };


export const AuthenticateWithBypass = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const token = req.headers.authorization;
  if (!token) {
    next();
    return;
  }
  const userId = tokenMap.get(token);
  if (!userId) {
    res.failure("Invalid token.");
    return;
  }

  const user = await getUsers().findOne({ _id: userId, });
  if (!user) {
    res.failure("User was not found.");
    return;
  }


  req.user = user;

  next();
}

export function atleastRole(
  role: Role
) {
  return function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      res.failure(
        "Not logged in",
        401
      );
      return;
    }
    const userRole =
      req.user.role;
    if (role > userRole) {
      res.failure(
        `No permission role: ${Role[userRole]} required: ${Role[role]}`,
        401
      );
      return;
    }
    next();
  };
}

export function hasPermissionForResource(
  pathToResourceId: string,
  bypassRole: Role
) {
  return async function (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let resourceId =
      req.body[
      pathToResourceId
      ];
    if (!resourceId) {
      resourceId =
        req.params[
        pathToResourceId
        ];
    }
    if (!resourceId) {
      res.failure(
        "Resource ID path does not exist, hence, permission access cannot be checked"
      );
      return;
    }

    if (!req.user) {
      res.failure(
        "not logged in",
        401
      );
      return;
    }

    const userRole =
      req.user.role;
    // if they have the bypass role, they can just be approved.
    if (
      bypassRole <= userRole
    ) {
      next();
      return;
    }

    const resource =
      await getDatabase()
        .collection<Resource>(
          RESOURCES_COLLECTION
        )
        .findOne({
          _id: resourceId,
        });
    if (!resource) {
      res.failure(
        "Resource does not exist, hence, permission to access cannot be checked."
      );
      return;
    }

    if (
      !canUseResource(resource, req.team.getAllTeams())
    ) {
      res.failure(
        "You do not have permission to access this resource."
      );
      return;
    }

    next();
  };
}
