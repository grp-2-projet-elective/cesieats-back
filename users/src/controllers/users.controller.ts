import { Router } from 'express';
import { UsersService } from 'services/users.service';
import { BadRequestException, NotFoundException } from 'utils/exceptions';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const UsersController = Router();

/**
 * Instance de notre usersService
 */
const usersService = new UsersService();

/**
 * Trouve tous les users
 */
UsersController.get('/', async (req, res) => {
    try {
        return res
            .status(200)
            .json(await usersService.findAll());
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Trouve un user en particulier
 */
UsersController.get('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const user = await usersService.findOne(id);

        return res
            .status(200)
            .json(user);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Créé un user
 */
UsersController.post('/', async (req, res) => {
    try {
        const createdUser = await usersService.create(req.body.userData, req.body.role);

        return res
            .status(201)
            .json(createdUser);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Mise à jour d'un user
 */
UsersController.patch('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedUser = await usersService.update(id, req.body.userData);

        return res
            .status(200)
            .json(updatedUser);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Suppression d'un user
 */
UsersController.delete('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const response = await usersService.delete(id);

        return res
            .status(200)
            .json(response);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { UsersController, usersService };

