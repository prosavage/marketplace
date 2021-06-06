import {NextFunction, Request, Response} from "express"



const injectReqResTypes = (req: Request, res: Response, next: NextFunction) => {
    
    req.team = {
        owned: undefined,
        memberOf: []
    }

    res.success = (payload) => {
        res.json({success: true, payload})
    }

    res.failure = (error, code = 400) => {
        res.status(code).json({success: false, error})
    }
    next();
}




export default injectReqResTypes;
