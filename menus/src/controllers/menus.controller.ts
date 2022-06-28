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
    return res
        .status(200)
        .json(await service.findAll());
});

/**
 * Trouve un menu en particulier
 */
MenusController.get('/:id', async (req, res) => {
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
});

/**
 * Créé un menu
 */
MenusController.post('/', async (req, res) => {
    const createdMenu = await service.create(req.body);

    return res
        .status(201)
        .json(createdMenu);
});

/**
 * Mise à jour d'un menu
 */
MenusController.patch('/:id', async (req, res) => {
    const id = req.params.id;

    if (!id) {
        throw new BadRequestException('Invalid id');
    }

    const updatedMenu = await service.update(id, req.body);

    return res
        .status(200)
        .json(updatedMenu);
});

/**
 * Suppression d'un menu
 */
MenusController.delete('/:id', async (req, res) => {
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
export { MenusController };

