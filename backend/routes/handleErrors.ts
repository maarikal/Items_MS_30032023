import {Request, Response, NextFunction} from 'express';

type HandlerWithNext = (req: Request, res: Response, next: NextFunction) => Response | Promise<Response> | void;

type HandlerWithoutNext = (req: Request, res: Response) => Response | Promise<Response> | void;

export const handleErrors = (...routeHandlers: Array<HandlerWithNext | HandlerWithoutNext>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            for (const routeHandler of routeHandlers) {
                await routeHandler(req, res, next);
            }
            return;
        } catch (err: any) {
            if (err.code === 'P2025') {
                return res.status(404).send({error: err.meta.cause})
            }
            next(err);
        }
    };
};
