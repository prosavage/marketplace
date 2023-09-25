import { ResourceType, Role } from "@savagelabs/types";
import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import shortid from "shortid";
import {  getCategories } from "../constants";
import { atleastRole, Authorize } from "../middleware/Authenticate";
import { isValidBody } from "../middleware/BodyValidate";

const categoryRouter = express.Router();

categoryRouter.put(
  "/",
  [
    body("name").exists().isString(),
    body("type")
      .exists()
      .isString()
      .custom((value: string) => value as ResourceType)
      .customSanitizer((value) => value as ResourceType),
    Authorize,
    atleastRole(Role.ADMIN),
    isValidBody,
  ],
  async (req: Request, res: Response) => {
    const category = {
      _id: shortid.generate(),
      name: req.body.name,
      type: req.body.type,
    };
    await getCategories().insertOne(category);
    res.success({ category });
  }
);

categoryRouter.get(
  "/:id",
  [param("id").isString(), isValidBody],
  async (req: Request, res: Response) => {
    const category = await getCategories()
      .findOne({ _id: req.params.id });

    res.success({ category });
  }
);

export default categoryRouter;
