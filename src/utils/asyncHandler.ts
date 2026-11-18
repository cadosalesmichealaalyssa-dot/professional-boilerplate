import { Request, Response, NextFunction } from 'express';

type AsyncResquestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const asyncHandler = (fn: AsyncResquestHandler) => {
    return(req: Request, res: Response, next: NextFunction) =>{
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};