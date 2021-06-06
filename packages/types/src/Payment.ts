import { Resource } from "./Resource";
import { User } from "./User";

export interface Payment {
  _id: string;
  timestamp: Date;
  amount: number;
  recipient: User["_id"];
  status: PaymentStatus;
  resource: Resource["_id"];
  user: User["_id"];
  payment_intent: string;
}

export interface DirectoryPayment {
  _id: string,
  timestamp: Date,
  amount: number,
  recipient: User
  status: PaymentStatus
  resource: Resource
  user: User,
  payment_intent: string
}

export enum PaymentStatus {
  STARTED = "STARTED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}
