import { BadRequestException, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { Router } from 'express';
import { DeliveriesService } from 'services/deliveries.service';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const DeliveriesController = Router();

/**
 * Instance de notre service
 */
const service = new DeliveriesService();

/**
 * Trouve tous les deliveries
 */
DeliveriesController.get('/', async (req, res) => {
    return res
        .status(200)
        .json(await service.findAll());
});

/**
 * Trouve un delivery en particulier
 */
DeliveriesController.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!id) {
        throw new BadRequestException('Invalid id');
    }

    const delivery = await service.findOne(id);

    if (!delivery) {
        throw new NotFoundException('No delivery found');
    }

    return res
        .status(200)
        .json(delivery);
});

/**
 * Créé un delivery
 */
DeliveriesController.post('/', async (req, res) => {
    const createdDelivery = await service.create(req.body);

    return res
        .status(201)
        .json(createdDelivery);
});

/**
 * Mise à jour d'un delivery
 */
DeliveriesController.patch('/:id', async (req, res) => {
    const id = req.params.id;

    if (!id) {
        throw new BadRequestException('Invalid id');
    }

    const updatedDelivery = await service.update(id, req.body);

    return res
        .status(200)
        .json(updatedDelivery);
});

/**
 * Suppression d'un delivery
 */
DeliveriesController.delete('/:id', async (req, res) => {
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
export { DeliveriesController };

