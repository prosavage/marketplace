import { Resource } from "./Resource";
import { Team } from "./Team";
import { User } from "./User";

export interface Webhook {
  _id: string;
  url: string;
  resource: Resource["_id"]
}




// OLD WEBHOOK TYPE FOR MORE COMPLEX HOOKS
export interface OldWebhook {
  _id: string;
  url: string;
  user: User["_id"];
  team: Team["_id"];
  name: string;
  secret: string | undefined;
  active: boolean;
  last_called: Date | undefined;
}






