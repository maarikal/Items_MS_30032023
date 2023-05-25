import {Request, Response, NextFunction} from 'express';

// Define a type for route handlers
type HandlerWithNext = (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | Promise<Response<any, Record<string, any>>> | void;

type HandlerWithoutNext = (req: Request, res: Response) => Response<any, Record<string, any>> | Promise<Response<any, Record<string, any>>> | void;

export const handleErrors = (...routeHandlers: Array<HandlerWithNext | HandlerWithoutNext>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            for (const routeHandler of routeHandlers) {
                await routeHandler(req, res, next);
            }
            return;
        } catch (err) {
            next(err);
        }
    };
};
