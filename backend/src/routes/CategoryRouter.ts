import express, { Request, Response } from "express";
import { body } from "express-validator";
import { CATEGORIES_COLLECTION } from "../constants";
import { atleastRole, Authorize } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";
import { getDatabase } from "../server";
import { Role } from "../struct/Role";
import { ResourceType } from "../types/Resource";

const categoryRouter = express.Router();

    categoryRouter.put("/",
    [
        body("name").exists().isString(),
        body("type").exists().isString()
            .custom((value: string) => value as ResourceType)
            .customSanitizer(value => value as ResourceType),
        Authorize,
        atleastRole(Role.ADMIN),
        isValidBody
    ],
    async (req: Request, res: Response) => {
        const category = { name: req.body.name, type: req.body.type }
        await getDatabase().collection(CATEGORIES_COLLECTION).insertOne(category)
        res.json({message: "Added to database.", category})
    })


export default categoryRouter;