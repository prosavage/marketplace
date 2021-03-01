import {User} from "./User";
import {Resource} from "./Resource";

interface Webhook {
	_id: string
	url: string
	events: string[]
	user: User["_id"]
	name: string
	resource: Resource['_id']|undefined
	secret: string|undefined
	active: boolean
	last_called: Date|undefined
}

export default Webhook
