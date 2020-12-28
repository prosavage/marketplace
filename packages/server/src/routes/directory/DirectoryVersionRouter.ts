import express, { Request, Response } from "express";
import { param } from "express-validator";
import { ObjectId } from "mongodb";
import { VERSIONS_COLLECTION } from "../../constants";
import { pageSearchCollectionWithFilter } from "../../database";
import { isValidBody } from "../../middleware/BodyValidate";

const directoryVersionRouter = express.Router();

directoryVersionRouter.get("/resource/:resource/:page", [
    param("resource").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    param("page").isInt().bail().toInt(),
    isValidBody
],
    async (req: Request, res: Response) => {
        const page = Number.parseInt(req.params.page!!);
        const versions = await pageSearchVersionsWithFilter({ resource: req.params.resource }, page)
        res.success({versions})
    }
);

const pageSearchVersionsWithFilter = async (filter: object, page: number) => {
    return pageSearchCollectionWithFilter(VERSIONS_COLLECTION, filter, page)
}

export default directoryVersionRouter;