import { Router } from 'express';
import { AuthMiddleware } from 'middlewares/auth.middleware';
import { UsersService } from 'services/users.service';
import { BadRequestException } from 'utils/exceptions';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const UsersController = Router();

/**
 * Instance de notre usersService
 */
const usersService = new UsersService();

/**
 * Trouve un user en particulier par son email
 */
UsersController.get('/:mail', async (req, res) => {
    try {
        const mail = req.params.mail;

        if (!mail) {
            throw new BadRequestException('Invalid mail');
        }

        const user = await usersService.findOne(mail);

        return res
            .status(200)
            .json(user);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * Trouve tous les users
 */
UsersController.get('/', async (req, res) => {
    try {
        return res
            .status(200)
            .json(await usersService.findAll());
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * Trouve un user en particulier
 */
UsersController.get('/asRole/:mail/:role', async (req, res) => {
    try {
        const mail = req.params.mail;
        const role = Number(req.params.role);

        if (!mail) {
            throw new BadRequestException('Invalid mail');
        }
        if (!role) {
            throw new BadRequestException('Invalid role');
        }

        const asRole = await usersService.asRole(mail, role);

        return res
            .status(200)
            .json(asRole);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * Créé un user
 */
UsersController.post('/', AuthMiddleware.verifyUserDucplication, async (req, res) => {
    try {
        const createdUser = await usersService.create(req.body);

        return res
            .status(201)
            .json(createdUser);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * Mise à jour d'un user
 */
UsersController.patch('/:mail', async (req, res) => {
    try {
        const mail = req.params.mail;

        if (!mail) {
            throw new BadRequestException('Invalid mail');
        }

        const updatedUser = await usersService.update(mail, req.body);

        return res
            .status(200)
            .json(updatedUser);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * Suppression d'un user
 */
UsersController.delete('/:mail', async (req, res) => {
    try {
        const mail = req.params.mail;

        if (!mail) {
            throw new BadRequestException('Invalid id');
        }

        const response = await usersService.delete(mail);

        return res
            .status(200)
            .json(response);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { UsersController, usersService };

