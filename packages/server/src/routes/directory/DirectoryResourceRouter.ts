import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import { ObjectId } from "mongodb";
import { CATEGORIES_COLLECTION, RESOURCES_COLLECTION } from "../../constants";
import { pageSearchCollectionWithFilter } from "../../database";
import { isValidBody } from "../../middleware/BodyValidate";
import { getDatabase } from "../../server";
import { ResourceType } from "../../types/Resource";

const directoryResourceRouter = express.Router();

directoryResourceRouter.get("/page/:page", [
    param("page").isInt().bail().toInt(),
    isValidBody
], async (req: Request, res: Response) => {
    const page: number = Number.parseInt(req.params.page!!);
    const resources = await pageSearchResourcesWithFilter({}, page)
    res.success({ resources })
});

directoryResourceRouter.get("/category/:type/:category/:page",
    [
        param("type").isString(),
        param("category").isString(),
        param("page").isInt().bail().toInt(),
        isValidBody
    ], async (req: Request, res: Response) => {
        const categoryName = req.params.category;
        const categoryFromDb = await getDatabase().collection(CATEGORIES_COLLECTION).findOne({ name: categoryName, type: req.params.type });
        const page: number = Number.parseInt(req.params.page!!);
        let filter = {}
        if (categoryFromDb != null) {
            filter = { category: categoryFromDb._id }
        }
        const resources = await pageSearchResourcesWithFilter(filter, page)
        res.success({ category: categoryFromDb, resources })
    }
);

directoryResourceRouter.get("/type/:type/:page",
    [
        param("type").isString(),
        param("page").isInt().bail().toInt(),
        isValidBody
    ], async (req: Request, res: Response) => {
        const page: number = Number.parseInt(req.params.page!!);
        let filter = {}
        const type = req.params.type as ResourceType;
        if (type) filter = { type }
        const resources = await pageSearchResourcesWithFilter(filter, page)

        res.success({ type, resources })
    }
);

directoryResourceRouter.get("/author/:user/:page",
    [
        param("user").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
        param("page").isInt().bail().toInt(),
        isValidBody
    ], async (req: Request, res: Response) => {
        const userId = req.params.user;
        const page: number = Number.parseInt(req.params.page!!)
        const resources = await pageSearchResourcesWithFilter({ owner: userId }, page)
        res.success({ resources })
    }
);


const pageSearchResourcesWithFilter = async (filter: object, page: number) => {
    return pageSearchCollectionWithFilter(RESOURCES_COLLECTION, filter, page)
}



export default directoryResourceRouter;