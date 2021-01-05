import express, { Request, Response } from "express";
import { param } from "express-validator";
import { CATEGORIES_COLLECTION } from "../../constants";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { Category } from "../../types/Category";
import { ResourceType } from "../../types/Resource";
import directoryResourceRouter from "./DirectoryResourceRouter";
import directoryVersionRouter from "./DirectoryVersionRouter";

const directoryRouter = express.Router();

directoryRouter.use("/resources", directoryResourceRouter)
directoryRouter.use("/versions", directoryVersionRouter)


directoryRouter.get("/categories/:type", [
    param("type").isString(),
    isValidBody
], async (req: Request, res: Response) => {
    const pluginType = req.params.type as ResourceType
    if (!pluginType) {
        res.failure("invalid plugin type.")
        return;
    }

    const categories = await getDatabase().collection<Category>(CATEGORIES_COLLECTION).find({ type: pluginType }).toArray()
    res.success({ categories })
})

export default directoryRouter;