import express from "express";
import bodyParser from "body-parser";
import getStripeAPI from "./stripe/StripeAPI";

const stripeWebhookRouter = express.Router();

stripeWebhookRouter.post('/finalize', bodyParser.raw({type: 'application/json'}), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        const stripeAPI = getStripeAPI()
        event = stripeAPI.webhooks.constructEvent(req.body, sig!!, "whsec_bXw3zIVagisIhlb4OPwtNS1kphHKFuMI");
    } catch (err) {
        // On error, log and return the error message
        console.log(`Error message: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return
    }

    // Successfully constructed event
    console.log('Success:', event.id, event.type);
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent: any = event.data.object;
        // TODO: Handle actually giving the user who bought the item the item....
        // Idk how to get the user who bought it since that's part of my app data
        // there is no customer for the user or anything
        console.log(JSON.stringify(paymentIntent))
    }

    // Return a response to acknowledge receipt of the event
    res.json({received: true});
});



export default stripeWebhookRouter;