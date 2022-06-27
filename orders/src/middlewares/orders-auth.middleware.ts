import { NextFunction, Request, Response } from 'express';

export abstract class OrdersAuthMiddleware {
    public static authorizedHosts: Array<string>;

    public static async isApiCall(req: Request, res: Response, next: NextFunction) {
        const hostname = req.hostname;
        console.log('API call from: ', hostname);

        if (OrdersAuthMiddleware.authorizedHosts.includes(hostname)) {
            (req as any).skipMiddlewares = true;
        }

        return next();
    }
}