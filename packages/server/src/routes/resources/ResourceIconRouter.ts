import express, { Request, Response } from "express";
import { param } from "express-validator";
import { ObjectId } from "mongodb";
import { Authorize, hasPermissionForResource } from "../../middleware/Authenticate";
import { isValidBody } from "../../middleware/BodyValidate";
import { bunny } from "../../server";
import { Role } from "../../struct/Role";

const resourceIconRouter = express.Router();

// UploadedFile from express-fileupload types seem to be broken
// the data prop does not exist on the type, but does on the actual file.
interface ImgFile {
    name: string,
    data: any,
    size: number,
    encoding: string,
    tempFilePath: string,
    truncated: boolean,
    mimetype: string,
    md5: string
}

resourceIconRouter.put("/:id", [
    param("id").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    Authorize,
    hasPermissionForResource("id", Role.ADMIN),
    isValidBody
], async (req: Request, res: Response) => {
    const files = req.files;
    // express-fileupload's type is broken. Using custom one to check buffer.
    const icon: ImgFile = files?.icon as ImgFile
    if (!files || !icon) {
        res.failure("Invalid file body.")
        return;
    }

    // basic quick check to see if its not just renamed, not foolproof, but all it breaks is a profile image soo.
    // valid pngs must start with below hex
    const MAGIC_PNG_BUFFER_START = "89504e47"
    const iconHexIdentifier = icon.data.toString("hex", 0, 4)
    if (iconHexIdentifier !== MAGIC_PNG_BUFFER_START) {
        res.failure("Failed PNG verification")
        return;
    }

    const dbId = req.params.id as unknown as ObjectId

    let getRes
    try {
        getRes = await bunny.getResourceIconById(req.params.id as unknown as ObjectId);
    } catch (err) {
        getRes = { data: err }
    }
    let replaced = false;
    if (!getRes.data.message) {
        // if message then 404 or error, try and delete
        await bunny.deleteResourceIconById(dbId)
        replaced = true
    }
    const result = await bunny.putResourceIconById(dbId, icon.data)
    res.success({ result: result.data, replaced })
})

resourceIconRouter.get("/:id", [
    param("id").isMongoId().bail().customSanitizer(v => new ObjectId(v)),
    Authorize,
    hasPermissionForResource("id", Role.ADMIN),
    isValidBody
], async (req: Request, res: Response) => {
    let result
    try {
        result = (await bunny.getResourceIconById(req.params.id as unknown as ObjectId)).data;
    } catch (err) {
        result = err.message
    }
    res.send(result)
})

resourceIconRouter.delete("/:id", [
    param("id").isMongoId().bail().customSanitizer(value => new ObjectId(value)),
    Authorize,
    hasPermissionForResource("id", Role.ADMIN),
    isValidBody
], async (req: Request, res: Response) => {
    const result = await bunny.deleteResourceIconById(req.params.id as unknown as ObjectId)
    res.success({ data: result.data })
})



export default resourceIconRouter;