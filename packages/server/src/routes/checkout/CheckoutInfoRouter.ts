import {Authorize} from "../../middleware/Authenticate";
import {isValidBody} from "../../middleware/BodyValidate";
import express, {Request, Response} from "express";
import {getDatabase} from "../../server";
import {Seller} from "../../types/User";
import {PAYMENTS_COLLECTION, RESOURCES_COLLECTION, SELLER_COLLECTION, USERS_COLLECTION} from "../../constants";
import getStripeAPI from "./stripe/StripeAPI";
import Axios from "axios";
import {param} from "express-validator";
import Payment from "../../types/Payment";


const checkoutInfoRouter = express.Router();

checkoutInfoRouter.get(
    "/link",
    [Authorize, isValidBody],
    async (req: Request, res: Response) => {
        const seller = await getDatabase()
            .collection<Seller>(SELLER_COLLECTION)
            .findOne({user: req.user!!._id});

        if (seller === null) {
            res.failure("seller not found.");
            return;
        }
        const stripeAPI = getStripeAPI();

        const link = await stripeAPI.accounts.createLoginLink(
            seller.stripe_account,
            {apiKey: process.env.STRIPE_SECRET_KEY}
        );

        res.success({link: link});
    }
);

checkoutInfoRouter.get(
    "/balance",
    [Authorize, isValidBody],
    async (req: Request, res: Response) => {
        const seller = await getDatabase()
            .collection<Seller>(SELLER_COLLECTION)
            .findOne({user: req.user!!._id})

        if (seller === null) {
            res.failure("seller not found.")
            return
        }

        const balance = await Axios.get("https://api.stripe.com/v1/balance", {
            headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                "Stripe-Account": seller.stripe_account
            }
        })

        res.success({balance: balance.data})
    }
)


checkoutInfoRouter.get("/purchases/:page", [param("page").isNumeric(), Authorize, isValidBody],
    async (req: Request, res: Response) => {
        const page = req.params.page as unknown as number;

        const payments = await getDatabase().collection<Payment>(PAYMENTS_COLLECTION).aggregate([
            {$match: {recipient: req.user!!._id}},
            {$sort: {timestamp: -1}},
            {$skip: (page - 1) * 10},
            {$limit: 10},
            {
                $lookup: {
                    from: RESOURCES_COLLECTION,
                    localField: "resource",
                    foreignField: "_id",
                    as: "resource",
                },
            },
            {
                $lookup: {
                    from: USERS_COLLECTION,
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {$unwind: "$user"},
            {$unwind: "$resource"},
            {$unset: ["user.email", "user.role", "user.password", "user.purchases"]}
        ]).toArray()

        res.success({payments})
    })


export default checkoutInfoRouter