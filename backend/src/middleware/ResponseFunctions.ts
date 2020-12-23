import { Request, Response, NextFunction } from "express"

const betterResponse = (_req: Request, res: Response, next: NextFunction) => {
    res.success = (payload) => {
        res.json({success: true, payload})
    }

    res.failure = (error) => {
        res.json({success: false, error})
    }
    next();
}

export default betterResponse;
