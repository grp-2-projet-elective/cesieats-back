import { AuthMiddlewares, BadRequestException, LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { Router } from 'express';
import { DeliveriesService } from 'services/deliveries.service';

const Logger: LoggerService = LoggerService.Instance('Deliveries API', environment.logDir);

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const DeliveriesController = Router();

/**
 * Instance de notre service
 */
const service = new DeliveriesService();

/**
 * Recupération des données statistiques des livraisons
 */
//  , AuthMiddlewares.hasCommercialDepartmentRole, AuthMiddlewares.hasTechnicalDepartmentRole
DeliveriesController.get('/stats', async (req, res) => {
    Logger.info('Requesting deliveries stats');
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
 * Trouver toutes les livraisons
 */
// , AuthMiddlewares.hasCommercialDepartmentRole, AuthMiddlewares.hasTechnicalDepartmentRole
DeliveriesController.get('/', async (req, res) => {
    Logger.info('Requesting all deliveries');
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
 * Trouver un livraison en particulier
 */
DeliveriesController.get('/deliveryman/:not?', async (req, res) => {
    Logger.info('Requesting available delivery man');
    try {
        const delivery = await service.findAvailableDeliveryMan(Number(req.params.not));

        return res
            .status(200)
            .json(delivery);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Trouver un livraison en particulier
 */
DeliveriesController.get('/:id', async (req, res) => {
    Logger.info('Requesting single delivery');
    try {
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
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Créé une livraison
 */
DeliveriesController.post('/', async (req, res) => {
    Logger.info('Requesting delivery creation');
    try {
        const createdDelivery = await service.create(req.body);

        return res
            .status(201)
            .json(createdDelivery);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Mise à jour d'une livraison
 */
DeliveriesController.patch('/:id', async (req, res) => {
    Logger.info('Requesting delivery update');
    try {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedDelivery = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedDelivery);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Suppression d'une livraison
 */
DeliveriesController.delete('/:id', async (req, res) => {
    Logger.info('Requesting delivery deletion');
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
export { DeliveriesController };

