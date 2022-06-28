import { BadRequestException } from '@grp-2-projet-elective/cesieats-helpers';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'services/users.service';

export abstract class UsersAuthMiddleware {
    public static authorizedHosts: Array<string>;

    public static async verifyUserDucplication(req: Request, res: Response, next: NextFunction) {
        const mail: string = req.body.mail;

        if (!mail) {
            throw new BadRequestException('User mail not provided');
        }

        const isUserDuplicated: boolean = await UsersService.isUserDuplicated(mail);

        if (isUserDuplicated) {
            throw new BadRequestException('User already exists');
        }

        return next();
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