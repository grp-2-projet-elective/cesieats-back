import { NextFunction, Request, Response } from 'express';
import { RestaurantsService } from 'services/restaurants.service';

export abstract class RestaurantAuthMiddleware {
    public static authorizedHosts: Array<string>;

    public static async isRestaurantDuplicated(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        try {
            const restaurantName: string = req.body.name;

            if (!restaurantName) {
                return res.status(400).send({ message: 'Restaurant name not provided' });
            }

            const isUserDuplicated: boolean = await RestaurantsService.isRestaurantDuplicated(restaurantName);

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

    public static async verifyRestaurantOwnership(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        try {
            const mail: string = req.body.mail;
            const restaurantId: number = Number(req.body.restaurantId);

            if (!mail) {
                return res.status(400).send({ message: 'User mail not provided' });
            }

            const isProfileOwner: boolean = await RestaurantsService.haveRestaurantOwnership(mail, restaurantId);

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

        if (RestaurantAuthMiddleware.authorizedHosts.includes(hostname)) {
            (req as any).skipMiddlewares = true;
        }

        return next();
    }


}