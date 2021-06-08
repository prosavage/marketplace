import { Resource, Team } from "@savagelabs/types";

export const canUseResource = (resource: Resource, teams: Team[]) => {
    
    console.log(resource.owner, teams.map(t => t?._id))
    for (const team of teams) {
        if (!team) continue;

        if (resource.owner === team._id) {
            return true;
        }
    }
    return false;
}