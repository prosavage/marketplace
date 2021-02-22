import {User} from "./User";

interface Payment {
    _id: string,
    user: User["_id"]
    status: PaymentStatus

}

export enum PaymentStatus {
    STARTED= "STARTED",CONFIRMED="CONFIRMED",CANCELLED="CANCELLED"
}

export default Payment;