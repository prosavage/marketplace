import express, { Request, Response } from "express";
import { param } from "express-validator";

import shortid from "shortid";
import { USERS_COLLECTION } from "../../constants";
import { Authorize } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { bunny, getDatabase } from "../../server";

const userIconRouter = express.Router();

// UploadedFile from express-fileupload types seem to be broken
// the data prop does not exist on the type, but does on the actual file.
interface ImgFile {
  name: string;
  data: any;
  size: number;
  encoding: string;
  tempFilePath: string;
  truncated: boolean;
  mimetype: string;
  md5: string;
}

userIconRouter.put(
  "/:id",
  [param("id").custom((id) => shortid.isValid(id)), Authorize, isValidBody],
  async (req: Request, res: Response) => {
    if (req.user?._id !== req.params.id) {
      res.failure("not your profile.");
      return;
    }

    const files = req.files;
    // express-fileupload's type is broken. Using custom one to check buffer.
    const icon: ImgFile = files?.icon as ImgFile;
    if (!files || !icon) {
      res.failure("Invalid file body.");
      return;
    }

    // basic quick check to see if its not just renamed, not foolproof, but all it breaks is a profile image soo.
    // valid pngs must start with below hex
    const MAGIC_PNG_BUFFER_START = "89504e47";
    const iconHexIdentifier = icon.data.toString("hex", 0, 4);
    if (iconHexIdentifier !== MAGIC_PNG_BUFFER_START) {
      res.failure("Failed PNG verification");
      return;
    }

    const dbId = req.params.id as string;

    let getRes;
    try {
      getRes = await bunny.getUserIconById(req.params.id as string);
    } catch (err) {
      getRes = { data: err };
    }
    let replaced = false;
    if (!getRes.data.message) {
      // if message then 404 or error, try and delete
      await bunny.deleteUserIconById(dbId);
      replaced = true;
    }
    const result = await bunny.putUserIconById(dbId, icon.data);
    console.log("setting to true.");
    await getDatabase()
      .collection(USERS_COLLECTION)
      .updateOne({ _id: req.params.id }, { $set: { hasIcon: true } });
    res.success({ result: result.data, replaced });
  }
);

userIconRouter.get(
  "/:id",
  [param("id").custom((id) => shortid.isValid(id)), Authorize, isValidBody],
  async (req: Request, res: Response) => {
    if (req.user?._id !== req.params.id) {
      res.failure("not your profile.");
      return;
    }
    let result;
    try {
      result = (await bunny.getUserIconById(req.params.id as string)).data;
    } catch (err) {
      result = err.message;
    }
    await getDatabase()
      .collection(USERS_COLLECTION)
      .updateOne({ _id: req.params.id }, { $set: { hasIcon: false } });
    res.send(result);
  }
);

userIconRouter.delete(
  "/:id",
  [param("id").custom((id) => shortid.isValid(id)), Authorize, isValidBody],
  async (req: Request, res: Response) => {
    if (req.user?._id !== req.params.id) {
      res.failure("not your profile.");
      return;
    }
    const result = await bunny.deleteUserIconById(req.params.id as string);
    res.success({ data: result.data });
  }
);

export default userIconRouter;
