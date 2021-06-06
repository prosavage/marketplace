import { User } from "./User";

export interface Webhook {
  _id: string;
  url: string;
  events: string[];
  user: User["_id"];
  name: string;
  secret: string | undefined;
  active: boolean;
  last_called: Date | undefined;
}
