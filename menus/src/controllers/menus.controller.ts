import { BadRequestException, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { Router } from 'express';
import { MenusService } from 'services/menus.service';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const MenusController = Router();

/**
 * Instance de notre service
 */
const service = new MenusService();

/**
 * Trouve tous les menus
 */
MenusController.get('/', async (req, res) => {
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
 * Trouve un menu en particulier
 */
MenusController.get('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

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
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Créé un menu
 */
MenusController.post('/', async (req, res) => {
    try {
        const createdMenu = await service.create(req.body);

        return res
            .status(201)
            .json(createdMenu);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Mise à jour d'un menu
 */
MenusController.patch('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedMenu = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedMenu);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Suppression d'un menu
 */
MenusController.delete('/:id', async (req, res) => {
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
export { MenusController };

