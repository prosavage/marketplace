import {
  FUser,
  User,
} from "./User";

export interface Team {
  _id: string;

  name: string;
  hasIcon: boolean;

  discordServerId:
    | number
    | undefined;

  owner: User["_id"];
  members: User["_id"][];
}

export interface TeamWithUsers {
  _id: string;

  name: string;
  hasIcon: boolean;

  discordServerId:
    | number
    | undefined;

  owner: FUser;
  members: FUser[];
}

export interface TeamInvite {
  _id: string;
  team: Team["_id"];
  invitee: User["_id"];
}

export interface TeamInviteWithTeam {
  _id: string;
  team: Team;
  invitee: User["_id"];
}

export interface TeamInviteWithUser {
  _id: string;
  team: Team["_id"];
  invitee: FUser;
}
