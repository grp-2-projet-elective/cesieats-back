import { environment } from 'environment/environment';
import { NextFunction, Request, Response } from 'express';

export abstract class MenusAuthMiddleware {
    public static authorizedHosts: Array<string> = environment.authorizedHosts;

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public static async isApiCall(req: Request, res: Response, next: NextFunction) {
        const hostname = req.hostname;
        console.log('API call from: ', hostname);

        if (MenusAuthMiddleware.authorizedHosts.includes(hostname)) {
            (req as any).skipMiddlewares = true;
        }

        return next();
    }
}