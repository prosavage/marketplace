import express, { Request, Response } from "express";
import { SELLER_COLLECTION } from "../../../constants";
import { Authorize } from "../../../middleware/Authenticate";
import { isValidBody } from "../../../middleware/BodyValidate";
import { getDatabase } from "../../../server";
import getStripeAPI from "./StripeAPI";
import shortid from "shortid";
import { Seller } from "../../../types/User";

const stripeSetupRouter = express.Router();

const stripeAPI = getStripeAPI();

stripeSetupRouter.get(
  "/create",
  [Authorize, isValidBody],
  async (req: Request, res: Response) => {
    const account = await stripeAPI.accounts.create(
      {
        type: "express",
      },
      { apiKey: process.env.STRIPE_SECRET_KEY }
    );

    let accountId = account.id;

    const seller = await getDatabase()
      .collection<Seller>(SELLER_COLLECTION)
      .findOne({ user: req.user!!._id });

    if (seller === null) {
      console.log("creating seller document");
      await getDatabase().collection(SELLER_COLLECTION).insertOne({
        _id: shortid.generate(),
        user: req.user!!._id,
        stripe_account: accountId,
      });
    } else {
      console.log("updating stripe_account");
      accountId = seller.stripe_account
    }

    const accountLink = await stripeAPI.accountLinks.create(
        {
          account: accountId,
          refresh_url: `${process.env.BASE_URL}/account/setup/stripe/reauth`,
          return_url: `${process.env.BASE_URL}/account/setup/stripe/return`,
          type: "account_onboarding",
        },
        { apiKey: process.env.STRIPE_SECRET_KEY }
      );

    res.success({ accountLink });
  }
);

stripeSetupRouter.get(
  "/verify",
  [Authorize, isValidBody],
  async (req: Request, res: Response) => {
    const seller = await getDatabase()
      .collection<Seller>(SELLER_COLLECTION)
      .findOne({ user: req.user!!._id });

    if (seller === null) {
      res.failure("seller not found.");
      return;
    }

    const account = await stripeAPI.accounts.retrieve(
      seller.stripe_account,
      undefined,
      { apiKey: process.env.STRIPE_SECRET_KEY }
    );
    res.success({ verified: account.details_submitted, account });
  }
);



export default stripeSetupRouter;
