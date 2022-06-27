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
 * Trouve un delivery en particulier
 */
DeliveriesController.get('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

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
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Créé un delivery
 */
DeliveriesController.post('/', async (req, res) => {
    try {
        const createdDelivery = await service.create(req.body);

        return res
            .status(201)
            .json(createdDelivery);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Mise à jour d'un delivery
 */
DeliveriesController.patch('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedDelivery = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedDelivery);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Suppression d'un delivery
 */
DeliveriesController.delete('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

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
export { DeliveriesController };

