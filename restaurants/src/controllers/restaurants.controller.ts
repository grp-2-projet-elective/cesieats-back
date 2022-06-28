import { BadRequestException, LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { Router } from 'express';
import { RestaurantsService } from 'services/restaurants.service';

const Logger: LoggerService = LoggerService.Instance('Restaurants API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/restaurants');

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const RestaurantsController = Router();

/**
 * Instance de notre service
 */
const service = new RestaurantsService();

/**
 * Trouve tous les restaurants
 */
RestaurantsController.get('/', async (req, res) => {
    Logger.info('Requesting all restaurants');
    return res
        .status(200)
        .json(await service.findAll());
});

/**
 * Trouve un restaurant en particulier
 */
RestaurantsController.get('/:id', async (req, res) => {
    Logger.info('Requesting single restaurant');
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
});

/**
 * Créé un restaurant
 */
RestaurantsController.post('/', async (req, res) => {
    Logger.info('Requesting restaurant creation');
    const createdRestaurant = await service.create(req.body);

    return res
        .status(201)
        .json(createdRestaurant);
});

/**
 * Mise à jour d'un restaurant
 */
RestaurantsController.patch('/:id', async (req, res) => {
    Logger.info('Requesting restaurant update');
    const id = req.params.id;

    if (!id) {
        throw new BadRequestException('Invalid id');
    }

    const updatedRestaurant = await service.update(id, req.body);

    return res
        .status(200)
        .json(updatedRestaurant);
});

/**
 * Suppression d'un restaurant
 */
RestaurantsController.delete('/:id', async (req, res) => {
    Logger.info('Requesting restaurant deletion');
    const id = req.params.id;

    if (!id) {
        throw new BadRequestException('Invalid id');
    }

    return res
        .status(200)
        .json(await service.delete(id));
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { RestaurantsController };

