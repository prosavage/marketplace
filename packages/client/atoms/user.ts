import {atom} from "recoil";
import {PersonalUser} from "../types/User";

export const userState = atom<PersonalUser | undefined>({
    key: "USER",
    default: undefined
})