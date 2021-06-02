import {atom} from "recoil";
import {PersonalUser} from "@savagelabs/types";

export const userState = atom<PersonalUser | undefined>({
    key: "USER",
    default: undefined
})