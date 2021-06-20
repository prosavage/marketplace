import { Resource, Team } from "@savagelabs/types";
import {CustomValidator} from "express-validator";
import shortid from "shortid";

export const canUseResource = (resource: Resource, teams: Team[]) => {
    
    for (const team of teams) {
        if (!team) continue;

        if (resource.owner === team._id) {
            return true;
        }
    }
    return false;
}

export const isShortId: CustomValidator = value => {
    return shortid.isValid(value);
};