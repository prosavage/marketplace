import {User} from "./User";
import {Resource} from "./Resource";

interface Payment {
    _id: string,
    timestamp: Date,
    amount: number,
    recipient: User["_id"]
    status: PaymentStatus
    resource: Resource["_id"]
    user: User["_id"]
    payment_intent: string
}



export enum PaymentStatus {
    STARTED = "STARTED",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED"
}

export default Payment;