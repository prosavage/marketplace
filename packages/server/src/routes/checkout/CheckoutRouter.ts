import express, { Request, Response } from "express";
import { param } from "express-validator";
import { RESOURCES_COLLECTION, SELLER_COLLECTION } from "../../constants";
import { Authorize } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { Resource } from "../../types/Resource";
import { Seller } from "../../types/User";
import getStripeAPI from "./stripe/StripeAPI";
import stripeSetupRouter from "./stripe/StripeSetupRouter";

const checkoutRouter = express.Router();

checkoutRouter.get(
  "/session/:resource",
  [param("resource").isString(), Authorize, isValidBody],
  async (req: Request, res: Response) => {
    const resource = await getDatabase()
      .collection<Resource>(RESOURCES_COLLECTION)
      .findOne({ _id: req.params.resource });

    if (resource === null) {
      res.failure("resource not found");
      return;
    }

    const seller = await getDatabase()
      .collection<Seller>(SELLER_COLLECTION)
      .findOne({ user: resource.owner });

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
        // 5 % + 30 cents stripe static
        // Stripe gets 2.9% + 30 cents of it. We get 2.1%
        application_fee_amount: price * 0.05 + 30,
        transfer_data: {
          destination: account.id,
        },
      },
      success_url: `${process.env.BASE_URL}/checkout/success`,
      cancel_url: `${process.env.BASE_URL}/checkout/cancel`,
    });

    res.success({ session });
  }
);

checkoutRouter.use("/stripe/setup", stripeSetupRouter);

export default checkoutRouter;
