import { BadRequestException, LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { Router } from 'express';
import { DeliveriesService } from 'services/deliveries.service';

const Logger: LoggerService = LoggerService.Instance('Deliveries API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/deliveries');

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
    Logger.info('Requesting all deliveries');
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
 * Trouve un delivery en particulier
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
        throw error;
    }
});

/**
 * Créé un delivery
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
        throw error;
    }
});

/**
 * Mise à jour d'un delivery
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
        throw error;
    }
});

/**
 * Suppression d'un delivery
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
        throw error;
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { DeliveriesController };

