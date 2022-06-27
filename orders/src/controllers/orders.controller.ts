import { BadRequestException, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { Router } from 'express';
import { OrdersService } from 'services/orders.service';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const OrdersController = Router();

/**
 * Instance de notre service
 */
const service = new OrdersService();

/**
 * Trouve tous les orders
 */
OrdersController.get('/', async (req, res) => {
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
 * Trouve un order en particulier
 */
OrdersController.get('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const order = await service.findOne(id);

        if (!order) {
            throw new NotFoundException('No order found');
        }

        return res
            .status(200)
            .json(order);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Créé un order
 */
OrdersController.post('/', async (req, res) => {
    try {
        const createdOrder = await service.create(req.body);

        return res
            .status(201)
            .json(createdOrder);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Mise à jour d'un order
 */
OrdersController.patch('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedOrder = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedOrder);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Suppression d'un order
 */
OrdersController.delete('/:id', async (req, res) => {
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
export { OrdersController };

