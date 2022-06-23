import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { Roles } from 'models/users.model';
import { UsersService } from 'services/users.service';

export abstract class AuthMiddleware {
    public static authorizedHosts: Array<string>;

    public static async verifyAccessToken(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        try {
            const accessToken: string = req.headers['x-access-token'] as string;

            if (!accessToken) {
                return res.status(403).send({ message: 'Auth token not provided' });
            }

            const isVerifiedToken = await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string);

            if (!isVerifiedToken) {
                return res.status(403).send({ message: 'Auth token invalid' });
            }

            return next();
        } catch (e: any) {
            console.error(e)
            return res.status(e.status ? e.status : 500).send(e);
        }
    }

    public static async verifyUserDucplication(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

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

    public static async isApiCall(req: Request, res: Response, next: NextFunction) {
        const hostname = req.hostname;
        console.log('API call from: ', hostname);

        if (AuthMiddleware.authorizedHosts.includes(hostname)) {
            (req as any).skipMiddlewares = true;
        }

        return next();
    }

    public static async isCustomer(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        const mail: string = req.body.mail;
        const excpectedRole = Roles.CUSTOMER;

        if (!mail) {
            return res.status(400).send({ message: 'User mail not provided' });
        }

        const isCustomer: boolean = await UsersService.asRole(mail, excpectedRole);

        if (!isCustomer) {
            return res.status(403).send({ message: 'Invalid role' });
        }

        return next();
    }

    public static async isRestaurantOwner(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        const mail: string = req.body.mail;
        const excpectedRole = Roles.RESTAURANT_OWNER;

        if (!mail) {
            return res.status(400).send({ message: 'User mail not provided' });
        }

        const isRestaurantOwner: boolean = await UsersService.asRole(mail, excpectedRole);

        if (!isRestaurantOwner) {
            return res.status(403).send({ message: 'Invalid role' });
        }

        return next();
    }

    public static async isDeliveryMan(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        const mail: string = req.body.mail;
        const excpectedRole = Roles.DELIVERY_MAN;

        if (!mail) {
            return res.status(400).send({ message: 'User mail not provided' });
        }

        const isDeliveryMan: boolean = await UsersService.asRole(mail, excpectedRole);

        if (!isDeliveryMan) {
            return res.status(403).send({ message: 'Invalid role' });
        }

        return next();
    }

    public static async isTechnicalDepartment(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        const mail: string = req.body.mail;
        const excpectedRole = Roles.TECHNICAL_DEPARTMENT;

        if (!mail) {
            return res.status(400).send({ message: 'User mail not provided' });
        }

        const isTechnicalDepartment: boolean = await UsersService.asRole(mail, excpectedRole);

        if (!isTechnicalDepartment) {
            return res.status(403).send({ message: 'Invalid role' });
        }

        return next();
    }

    public static async isCommercialDepartment(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        const mail: string = req.body.mail;
        const excpectedRole = Roles.TECHNICAL_DEPARTMENT;

        if (!mail) {
            return res.status(400).send({ message: 'User mail not provided' });
        }

        const isCommercialDepartment: boolean = await UsersService.asRole(mail, excpectedRole);

        if (!isCommercialDepartment) {
            return res.status(403).send({ message: 'Invalid role' });
        }

        return next();
    }
}