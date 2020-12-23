import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function existsInBody(properties: string[]) {   
    return function(req: Request, res: Response, next: NextFunction) {
        for (const property of properties) {
            if (typeof req.body[property]) {
                // not existing
                res.status(400).json({error: "Invalid body."})
                return;
            }
        }
        next();
    }
}

export const isValidBody = (req: Request, res: Response, next: NextFunction) => {
    const valid = validationResult(req);
    if (!valid.isEmpty()) {
        res.status(400).json({errors: valid.array()})
        return;
    }
    next();
}