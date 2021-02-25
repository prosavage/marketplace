import express from "express";
import bodyParser from "body-parser";
import getStripeAPI from "./stripe/StripeAPI";
import {getDatabase} from "../../server";
import Payment, {PaymentStatus} from "../../types/Payment";
import {PAYMENTS_COLLECTION, USERS_COLLECTION} from "../../constants";
import {User} from "../../types/User";

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post('/finalize', bodyParser.raw({type: 'application/json'})
    , async (req, res) => {
        const sig = req.headers['stripe-signature'];

        let event;

        try {
            const stripeAPI = getStripeAPI()
            event = stripeAPI.webhooks.constructEvent(req.body, sig!!, process.env.STRIPE_WEBHOOK_SECRET!!);
        } catch (err) {
            // On error, log and return the error message
            console.log(`Error message: ${err.message}`);
            res.failure(`Webhook Error: ${err.message}`);
            return
        }

        // Successfully constructed event
        console.log('Webhook Event Success:', event.id, event.type);
        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent: any = event.data.object;
            console.log("PAYMENT INTENT")
            // We only put one item in cart so we can just use the first element of the charges array...
            const charge = paymentIntent.charges.data[0];
            const payment_intent = charge.payment_intent;
            const payment = await getDatabase().collection<Payment>(PAYMENTS_COLLECTION).findOne({payment_intent});
            if (payment === null) {
                console.log("Invalid payment_intent...")
                console.log("Something was went wrong.")
                console.log({paymentIntent})
                res.failure(`payment not found in database. payment_intent: ${payment_intent}`)
                return
            }
            if (!charge.paid) {
                console.log("charge was not paid.")
                res.failure(`charge was not paid.`)
                return
            }


            const recipient = await getDatabase().collection(USERS_COLLECTION).findOne({_id: payment.recipient})
            console.log(recipient, payment.resource)
            // just in case...
            if (!recipient.purchases.includes(payment.resource)) {
                await getDatabase().collection<User>(USERS_COLLECTION)
                    .updateOne({_id: payment.user}, {$push: {purchases: payment.resource}})
            }


            await getDatabase().collection<Payment>(PAYMENTS_COLLECTION).updateOne({_id: payment._id}, {$set: {status: PaymentStatus.CONFIRMED}})
            console.log({payment}, "was fullfilled.")
        }


        // Return a response to acknowledge receipt of the event
        res.json({received: true});
    });


export default stripeWebhookRouter;