import {
  Team,
  TeamInvite,
} from "@savagelabs/types";
import express, {
  Request,
  Response,
} from "express";
import { param } from "express-validator";
import shortid from "shortid";
import {
  getInvites,
  INVITED_COLLECTION,
  TEAMS_COLLECTION,
  USERS_COLLECTION,
} from "../../constants";
import { Authorize } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";

const directoryTeamInvite =
  express.Router();

directoryTeamInvite.get(
  "/me",
  [Authorize],
  async (
    req: Request,
    res: Response
  ) => {
    const id = req.user!!._id;

    const invites =
      await getInvites()
        .aggregate([
          {
            $match: {
              invitee: id,
            },
          },
          {
            $lookup: {
              from: TEAMS_COLLECTION,
              localField:
                "team",
              foreignField:
                "_id",
              as: "team",
            },
          },
          {
            $unwind: "$team",
          },
        ])
        .toArray();

    res.success({ invites });
  }
);

directoryTeamInvite.get(
  "/by-team/:id",
  [
    param("id").custom((v) =>
      shortid.isValid(v)
    ),
    isValidBody,
    Authorize,
  ],
  async (
    req: Request,
    res: Response
  ) => {
    const id = req.params.id;

    const team =
      await getDatabase()
        .collection<Team>(
          TEAMS_COLLECTION
        )
        .findOne({ _id: id });
    if (team === null) {
      res.failure(
        "This team does not exist."
      );
      return;
    }

    if (
      team.owner !==
        req.user!._id &&
      !team.members.includes(
        req.user!._id
      )
    ) {
      res.failure(
        "You aren't a member of this team."
      );
      return;
    }

    const invites =
      await getDatabase()
        .collection<TeamInvite>(
          INVITED_COLLECTION
        )
        .aggregate([
          {
            $match: {
              team: team._id,
            },
          },
          {
            $lookup: {
              from: USERS_COLLECTION,
              localField:
                "invitee",
              foreignField:
                "_id",
              as: "invitee",
            },
          },
          {
            $unwind:
              "$invitee",
          },
          {
            $unset: [
              "invitee.email",
              "invitee.role",
              "invitee.password",
              "invitee.purchases",
            ],
          },
        ])
        .toArray();

    res.success({ invites });
  }
);

export default directoryTeamInvite;
