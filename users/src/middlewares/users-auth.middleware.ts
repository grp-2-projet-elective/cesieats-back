import { BadRequestException, LoggerService } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'services/users.service';

export abstract class UsersAuthMiddleware {
    public static authorizedHosts: Array<string>;
    private static Logger: LoggerService = LoggerService.Instance('Users API', environment.logDir);

    public static async verifyUserDucplication(req: Request, res: Response, next: NextFunction) {
        try {
            const mail: string = req.body.mail;

            if (!mail) {
                throw new BadRequestException('User mail not provided');
            }

            const isUserDuplicated: boolean = await UsersService.isUserDuplicated(mail);

            if (isUserDuplicated) {
                throw new BadRequestException('User already exists');
            }

            return next();
        } catch (error) {
            UsersAuthMiddleware.Logger.error(error);
            res.status((error as any).status).json(error);
        }
    }

    public static async isApiCall(req: Request, res: Response, next: NextFunction) {
        const hostname = req.hostname;
        UsersAuthMiddleware.Logger.info('API call from: ', hostname);

        if (UsersAuthMiddleware.authorizedHosts.includes(hostname)) {
            UsersAuthMiddleware.Logger.info('Skip default verification');
            (req as any).skipMiddlewares = true;
        }

        return next();
    }
}