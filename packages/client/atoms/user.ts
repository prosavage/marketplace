import {atom} from "recoil";
import {PersonalUser, User} from "../types/User";

export const userState = atom<PersonalUser | undefined>({
    key: "USER",
    default: undefined
})