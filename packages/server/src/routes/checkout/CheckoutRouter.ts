import { Payment, PaymentStatus, Resource, Seller } from "@savagelabs/types";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import shortid from "shortid";
import {
  getTeams,
  getUsers,
  PAYMENTS_COLLECTION,
  RESOURCES_COLLECTION,
  SELLER_COLLECTION,
} from "../../constants";
import { Authorize } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import checkoutInfoRouter from "./CheckoutInfoRouter";
import getStripeAPI from "./stripe/StripeAPI";
import stripeSetupRouter from "./stripe/StripeSetupRouter";

const checkoutRouter = express.Router();

checkoutRouter.use(checkoutInfoRouter);

checkoutRouter.post(
  "/session/:resource",
  [
    param("resource").isString(),
    body("baseurl").isString(),
    Authorize,
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const resource = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .findOne({ _id: req.params.resource });

    if (resource === null) {
      res.failure("resource not found");
      return;
    }

    const team = await getTeams().findOne({_id: resource.owner});

    if (team === null) {
      res.failure("resource owner team was not found.")
      return;
    }

    const ownerUser = await getUsers().findOne({_id: team.owner});
    
    if (ownerUser === null) {
      res.failure("owner user was not found.")
      return;
    }

    const seller = await getDatabase()
      .collection<Seller>(SELLER_COLLECTION)
      .findOne({ user: ownerUser?._id });

    if (seller === null) {
      res.failure("This seller has not setup their payment details.");
      return;
    }

    const stripeAPI = getStripeAPI();

    const account = await stripeAPI.accounts.retrieve(
      seller!!.stripe_account,
      undefined,
      { apiKey: process.env.STRIPE_SECRET_KEY }
    );

    if (!account?.details_submitted) {
      res.failure("Seller account details are invalid.");
      return;
    }

    if (!account?.charges_enabled) {
      res.failure("Seller's account cannot accept payments right now.");
      return;
    }

    const price = resource.price * 100;
    const session = await stripeAPI.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          name: `${resource.name}`,
          amount: price,
          currency: "usd",
          quantity: 1,
        },
      ],
      payment_intent_data: {
        // 5 % + 50 cents fee static
        // Stripe gets 2.9% + 30 cents of it. We get 2.1% + 20 cents
        application_fee_amount: Math.ceil(price * 0.05 + 50),
        transfer_data: {
          destination: account.id,
        },
      },
      success_url: `${req.body.baseurl}/checkout/success`,
      cancel_url: `${req.body.baseurl}/checkout/cancel`,
    });



    const payment: Payment = {
      _id: shortid.generate(),
      timestamp: new Date(),
      amount: price,
      user: req.user!!._id,
      payment_intent: session.payment_intent!!.toString(),
      recipient: ownerUser._id,
      resource: resource._id,
      status: PaymentStatus.STARTED,
    };

    await getDatabase()
      .collection<Payment>(PAYMENTS_COLLECTION)
      .insertOne(payment);
    console.log("made session:");
    console.log({
      session: session.id,
      payment_intent: session.payment_intent,
    });
    res.success({ session });
  }
);

checkoutRouter.use("/stripe/setup", stripeSetupRouter);

export default checkoutRouter;
