import { environment } from 'environment/environment';
import { NextFunction, Request, Response } from 'express';
import { RestaurantsService } from 'services/restaurants.service';

export abstract class RestaurantAuthMiddleware {
    public static authorizedHosts: Array<string> = environment.authorizedHosts;

    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     * @returns 
     */
    public static async isRestaurantDuplicated(req: Request, res: Response, next: NextFunction) {
        if ((req as any).skipMiddlewares) {
            return next();
        }

        const restaurantName: string = req.body.name;

        if (!restaurantName) {
            return res.status(400).send({ message: 'Restaurant name not provided' });
        }

        const isUserDuplicated: boolean = await RestaurantsService.isRestaurantDuplicated(restaurantName);

        if (isUserDuplicated) {
            return res.status(400).send({ message: 'User already exists' });
        }

        return next();
    }

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

        if (RestaurantAuthMiddleware.authorizedHosts.includes(hostname)) {
            (req as any).skipMiddlewares = true;
        }

        return next();
    }


}