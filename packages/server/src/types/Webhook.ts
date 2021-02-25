import {User} from "./User";

interface Webhook {
	_id: string
	url: string
	events: string[]
	user: User["_id"]
	name: string
	secret: string|undefined
	active: boolean
	last_called: Date|undefined
}

export default Webhook
