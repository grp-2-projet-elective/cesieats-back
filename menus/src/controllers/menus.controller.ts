import { AuthMiddlewares, BadRequestException, LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { Router } from 'express';
import { MenusService } from 'services/menus.service';

const Logger: LoggerService = LoggerService.Instance('Menus API', environment.logDir);

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const MenusController = Router();

/**
 * Instance de notre service
 */
const service = new MenusService();

/**
 * Recupération des données statistiques des menus
 */
//  , AuthMiddlewares.hasCommercialDepartmentRole, AuthMiddlewares.hasTechnicalDepartmentRole
MenusController.get('/stats', async (req, res) => {
    Logger.info('Requesting menus stats');
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
 * Trouver tous les menus
 */
//  , AuthMiddlewares.hasCommercialDepartmentRole, AuthMiddlewares.hasTechnicalDepartmentRole
MenusController.get('/', async (req, res) => {
    Logger.info('Requesting all menus');
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
 * Trouver un menu en particulier
 */
MenusController.get('/:id', async (req, res) => {
    Logger.info('Requesting single menu');
    try {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const menu = await service.findOne(id);

        if (!menu) {
            throw new NotFoundException('No menu found');
        }

        return res
            .status(200)
            .json(menu);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Créé un menu
 */
MenusController.post('/', async (req, res) => {
    Logger.info('Requesting menu creation');
    try {
        const createdMenu = await service.create(req.body);

        return res
            .status(201)
            .json(createdMenu);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Mise à jour d'un menu
 */
MenusController.patch('/:id', async (req, res) => {
    Logger.info('Requesting menu update');
    try {
        const id = req.params.id;

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedMenu = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedMenu);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Suppression d'un menu
 */
MenusController.delete('/:id', async (req, res) => {
    Logger.info('Requesting menu deletion');
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
export { MenusController };

