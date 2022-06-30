import { AuthMiddlewares, BadRequestException, LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { Router } from 'express';
import { OrdersService } from 'services/orders.service';

const Logger: LoggerService = LoggerService.Instance('Orders API', environment.logDir);

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const OrdersController = Router();

/**
 * Instance de notre service
 */
const service = new OrdersService();

/**
 * Recupération des données statistiques des commandes
 */
//  , AuthMiddlewares.hasCommercialDepartmentRole, AuthMiddlewares.hasTechnicalDepartmentRole
OrdersController.get('/stats', async (req, res) => {
    Logger.info('Requesting orders stats');
    try {
        const response = await service.getStats();

        return res
            .status(200)
            .json(response);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Trouver toutes les commandes
 */
//  , AuthMiddlewares.hasCommercialDepartmentRole, AuthMiddlewares.hasTechnicalDepartmentRole
OrdersController.get('/', async (req, res) => {
    Logger.info('Requesting all orders');
    try {
        return res
            .status(200)
            .json(await service.findAll());
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Trouver une commande en particulier
 */
OrdersController.get('/:id', async (req, res) => {
    Logger.info('Requesting single user');
    try {
        const id = req.params.id;

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
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Créer une commande
 */
OrdersController.post('/', async (req, res) => {
    Logger.info('Requesting order creation');
    try {
        const createdOrder = await service.create(req.body);

        return res
            .status(201)
            .json(createdOrder);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Mise à jour d'une commande
 */
OrdersController.patch('/:id', async (req, res) => {
    Logger.info('Requesting order update');
    try {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedOrder = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedOrder);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Suppression d'une commande
 */
OrdersController.delete('/:id', async (req, res) => {
    Logger.info('Requesting order deletion');
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
        res.json(error);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { OrdersController };

