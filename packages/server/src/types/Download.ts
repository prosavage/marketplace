import { User } from "./User";
import { Version } from "./Version";


// Represents download each time someone downloads a resource...
// Used to check if we need to bump download counter or not each update.
export default interface Download {
    _id: string;
    user: User["_id"];
    version: Version["_id"]
}