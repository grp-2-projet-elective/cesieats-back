import { BadRequestException, LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { Router } from 'express';
import { RestaurantsService } from 'services/restaurants.service';

const Logger: LoggerService = LoggerService.Instance('Restaurants API', environment.logDir);

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const RestaurantsController = Router();

/**
 * Instance de notre service
 */
const service = new RestaurantsService();

/**
 * Recupération des données statistiques des restaurants
 */
RestaurantsController.get('/stats', async (req, res) => {
    Logger.info('Requesting users stats');
    try {
        const response = await service.getStats();

        return res
            .status(200)
            .json(response);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Trouve tous les restaurants
 */
RestaurantsController.get('/', async (req, res) => {
    Logger.info('Requesting all restaurants');
    try {
        return res
            .status(200)
            .json(await service.findAll());
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Trouve un restaurant par son propriétaire
 */
 RestaurantsController.get('/byowner/:ownerId', async (req, res) => {
    Logger.info('Requesting single restaurant by owner');
    try {
        const ownerId = req.params.ownerId;

        if (!ownerId) {
            throw new BadRequestException('Invalid ownerId');
        }

        const restaurant = await service.findOneByOwner(ownerId);

        if (!restaurant) {
            throw new NotFoundException('No restaurant found');
        }

        return res
            .status(200)
            .json(restaurant);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Trouve un restaurant en particulier
 */
RestaurantsController.get('/:id', async (req, res) => {
    Logger.info('Requesting single restaurant');
    try {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const restaurant = await service.findOne(id);

        if (!restaurant) {
            throw new NotFoundException('No restaurant found');
        }

        return res
            .status(200)
            .json(restaurant);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Créer un restaurant
 */
RestaurantsController.post('/', async (req, res) => {
    Logger.info('Requesting restaurant creation');
    try {
        const createdRestaurant = await service.create(req.body);

        return res
            .status(201)
            .json(createdRestaurant);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Mise à jour d'un restaurant
 */
RestaurantsController.patch('/:id', async (req, res) => {
    Logger.info('Requesting restaurant update');
    try {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedRestaurant = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedRestaurant);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Suppression d'un restaurant
 */
RestaurantsController.delete('/:id', async (req, res) => {
    Logger.info('Requesting restaurant deletion');
    try {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        return res
            .status(200)
            .json(await service.delete(id));
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { RestaurantsController };

