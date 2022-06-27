import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'services/users.service';

export abstract class UsersAuthMiddleware {
    public static authorizedHosts: Array<string>;

    public static async verifyUserDucplication(req: Request, res: Response, next: NextFunction) {
        try {
            const mail: string = req.body.mail;

            if (!mail) {
                return res.status(400).send({ message: 'User mail not provided' });
            }

            const isUserDuplicated: boolean = await UsersService.isUserDuplicated(mail);

            if (isUserDuplicated) {
                return res.status(400).send({ message: 'User already exists' });
            }

            return next();
        } catch (e: any) {
            console.error(e);
            return res
                .status(e.status ? e.status : 500)
                .json(e);
        }
    }

    public static async verifyProfileOwnership(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        try {
            const accessToken: string = req.headers['x-access-token'] as string;
            const id = req.body.id;

            const isProfileOwner: boolean = await UsersService.isProfileOwner(id, accessToken);

            if (!isProfileOwner) {
                return res.status(400).send({ message: 'Unauthorized' });
            }

            return next();
        } catch (e: any) {
            console.error(e);
            return res
                .status(e.status ? e.status : 500)
                .json(e);
        }
    }

    public static async isApiCall(req: Request, res: Response, next: NextFunction) {
        const hostname = req.hostname;
        console.log('API call from: ', hostname);

        if (UsersAuthMiddleware.authorizedHosts.includes(hostname)) {
            (req as any).skipMiddlewares = true;
        }

        return next();
    }
}