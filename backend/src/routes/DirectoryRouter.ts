import express, {Request, Response} from "express";
import { param } from "express-validator";
import { CATEGORIES_COLLECTION, RESOURCES_COLLECTION } from "../constants";
import { isValidBody } from "../middleware/BodyValidate";
import { getDatabase } from "../server";
import { ResourceType } from "../types/Resource";

const directoryRouter = express.Router();

directoryRouter.get("/page/:page", [
    param("page").isInt().bail().toInt(),
    isValidBody
], async (req: Request, res: Response) => {
    const page: number = Number.parseInt(req.params.page);
    const limit = 10
    const resources = await getDatabase().collection(RESOURCES_COLLECTION).find()
    .sort({ updated: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

    res.json({success: true, resources})
})

directoryRouter.get("/category/:type/:category/:page",
[
    param("type").isString(),
    param("category").isString(),
    param("page").isInt().bail().toInt(),
    isValidBody
], async (req: Request, res: Response) => {
    const categoryName = req.params.category;
    const categoryFromDb = await getDatabase().collection(CATEGORIES_COLLECTION).findOne({name: categoryName, type: req.params.type});
    const page: number = Number.parseInt(req.params.page);
    const limit = 10
    let filter = {}
    if (categoryFromDb != null) {
        filter = {category: categoryFromDb._id}
    }
    const resources = await getDatabase().collection(RESOURCES_COLLECTION).find(filter)
    .sort({ updated: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

    res.json({success: true, category: categoryFromDb, resources})
})

directoryRouter.get("/type/:type/:page",
[
    param("type").isString(),
    param("page").isInt().bail().toInt(),
    isValidBody
], async (req: Request, res: Response) => {
    const page: number = Number.parseInt(req.params.page);
    const limit = 10
    let filter = {}
    const type = req.params.type as ResourceType;
    if (type) filter = {type}
    const resources = await getDatabase().collection(RESOURCES_COLLECTION).find(filter)
    .sort({ updated: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

    res.json({success: true, type, resources})
})

export default directoryRouter;