import { NextFunction, Request, Response } from 'express';

export abstract class DeliveriesAuthMiddleware {
    public static authorizedHosts: Array<string>;

    public static async isApiCall(req: Request, res: Response, next: NextFunction) {
        const hostname = req.hostname;
        console.log('API call from: ', hostname);

        if (DeliveriesAuthMiddleware.authorizedHosts.includes(hostname)) {
            (req as any).skipMiddlewares = true;
        }

        return next();
    }
}