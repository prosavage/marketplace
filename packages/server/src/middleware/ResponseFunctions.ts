import { Request, Response, NextFunction } from "express"

const betterResponse = (_req: Request, res: Response, next: NextFunction) => {
    res.success = (payload) => {
        res.json({success: true, payload})
    }

    res.failure = (error, code = 400) => {
        res.status(code).json({success: false, error})
    }
    next();
}

export default betterResponse;
