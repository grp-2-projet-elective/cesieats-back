import { BadRequestException, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { Router } from 'express';
import { RestaurantsService } from 'services/restaurants.service';

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
    try {
        return res
            .status(200)
            .json(await service.findAll());
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Trouve un restaurant en particulier
 */
RestaurantsController.get('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

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
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Créé un restaurant
 */
RestaurantsController.post('/', async (req, res) => {
    try {
        const createdRestaurant = await service.create(req.body);

        return res
            .status(201)
            .json(createdRestaurant);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Mise à jour d'un restaurant
 */
RestaurantsController.patch('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedRestaurant = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedRestaurant);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Suppression d'un restaurant
 */
RestaurantsController.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        return res
            .status(200)
            .json(await service.delete(id));
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { RestaurantsController };

