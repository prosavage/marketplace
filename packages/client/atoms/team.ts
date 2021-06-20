import { Team } from "@savagelabs/types";
import { atom } from "recoil";

export const teamState = atom<Team[] | undefined>({
  key: "TEAM",
  default: undefined,
});
