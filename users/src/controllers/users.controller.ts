import { AuthMiddlewares, BadRequestException, LoggerService } from '@grp-2-projet-elective/cesieats-helpers';
import { Router } from 'express';
import { UsersAuthMiddleware } from 'middlewares/users-auth.middleware';
import { UsersService } from 'services/users.service';

const Logger: LoggerService = LoggerService.Instance('Users API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/users');

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const UsersController = Router();

/**
 * Instance de notre usersService
 */
const usersService = new UsersService();

UsersController.get('/stats', async (req, res) => {
    Logger.info('Requesting users stats');
    try {
        const response = await usersService.getStats();

        return res
            .status(200)
            .json(response);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Trouve tous les users
 */
UsersController.get('/', AuthMiddlewares.hasCommercialDepartmentRole, async (req, res) => {
    Logger.info('Requesting all users');
    try {
        return res
            .status(200)
            .json(await usersService.findAll());
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Trouve un user en particulier par son email
 */
UsersController.get('/:id?/:mail?', async (req, res) => {
    Logger.info('Requesting single user');
    try {
        const id = Number(req.params.id);
        const mail = req.params.mail;

        if (!id && !mail) {
            throw new BadRequestException('Invalid parameters');
        }

        if (mail) {
            const user = await usersService.findOneByMail(mail);

            return res
                .status(200)
                .json(user);
        }

        const user = await usersService.findOne(id);

        return res
            .status(200)
            .json(user);

    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Créé un user
 */
UsersController.post('/', UsersAuthMiddleware.verifyUserDucplication, async (req, res) => {
    Logger.info('Requesting user creation');
    try {
        const createdUser = await usersService.create(req.body);

        return res
            .status(201)
            .json(createdUser);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Mise à jour d'un user
 */
UsersController.patch('/:id', async (req, res) => {
    Logger.info('Requesting user update');
    try {
        const id = Number(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedUser = await usersService.update(id, req.body);

        return res
            .status(200)
            .json(updatedUser);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * Suppression d'un user
 */
UsersController.delete('/:id', async (req, res) => {
    Logger.info('Requesting user deletion');
    try {
        const id = Number(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const response = await usersService.delete(id);

        return res
            .status(200)
            .json(response);
    } catch (error) {
        Logger.error(error);
        throw error;
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { UsersController, usersService };

