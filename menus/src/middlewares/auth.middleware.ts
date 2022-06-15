import { createHmac } from 'crypto';
import { NextFunction, Request, Response } from 'express';

export abstract class AuthMiddleware {
    public static verifyAccessToken(req: Request, res: Response, next: NextFunction) {
        const accessToken: string = req.headers["x-access-token"] as string;

        if (!accessToken) {
            return res.status(403).send({ message: "Auth token not provided!" });
        }

        const validHashedToken = createHmac('sha256', '').update(process.env.ACCESS_TOKEN as string).digest('hex');
        const hashedToken = createHmac('sha256', '').update(accessToken).digest('hex');

        if (hashedToken !== validHashedToken) {
            return res.status(403).send({ message: "Auth token invalid!" });
        }

        return next();
    }
}