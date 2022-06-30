import { AuthMiddlewares, BadRequestException, LoggerService } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { Router } from 'express';
import { UsersAuthMiddleware } from 'middlewares/users-auth.middleware';
import { UsersService } from 'services/users.service';
import * as bcrypt from 'bcrypt';

const Logger: LoggerService = LoggerService.Instance('Users API', environment.logDir);

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const UsersController = Router();

/**
 * Instance de notre usersService
 */
const usersService = new UsersService();

/**
 * Recupération des données statistiques des utilisateurs
 */
//  AuthMiddlewares.hasCommercialDepartmentRole, AuthMiddlewares.hasTechnicalDepartmentRole,
UsersController.get('/stats', async (req, res, next) => {
    Logger.info('Requesting users stats');
    try {
        const response = await usersService.getStats();

        return res
            .status(200)
            .json(response);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Trouve tous les utilisateurs
 */
// , AuthMiddlewares.hasCommercialDepartmentRole, AuthMiddlewares.hasTechnicalDepartmentRole
UsersController.get('/', async (req, res, next) => {
    Logger.info('Requesting all users');
    try {
        return res
            .status(200)
            .json(await usersService.findAll());
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Trouve un utilisateur en particulier par son email ou son id
 */
UsersController.get('/:key', AuthMiddlewares.verifyProfileOwnership, async (req, res, next) => {
    Logger.info('Requesting single user');
    try {
        let id;
        let mail;

        if(req.params.key.includes('@')) {
            id = null
            mail = req.params.key;
        } else {
            id = Number(req.params.key);
            mail = null
        }

        if (!id && !mail) {
            throw new BadRequestException('Invalid parameters');
        }

        if (mail) {
            const user = await usersService.findOneByMail(mail);

            return res
                .status(200)
                .json(user);
        }

        const user = await usersService.findOne(id as number);

        return res
            .status(200)
            .json(user);

    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Trouve tous les utilisateurs
 */
 UsersController.post('/availableDeliveryMan', async (req, res, next) => {
    Logger.info('Requesting delivery man');
    try {
        const unavailableDeliveryMans = req.body.unavailableDeliveryMans;
        return res
            .status(200)
            .json(await usersService.findAvailableDelivery(unavailableDeliveryMans));
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});

/**
 * Créer un utilisateur
 */
UsersController.post('/', UsersAuthMiddleware.verifyUserDucplication, async (req, res, next) => {
    Logger.info('Requesting user creation');
    try {
        const createdUser = await usersService.create(req.body);

        return res
            .status(201)
            .json(createdUser);
    } catch (error) {
        Logger.error(error);
        res.json(error);
    }
});


/**
 * Mettre à jour le mot de passe d'un utilisateur
 */
 UsersController.patch("/updatePassword/:id", async (req, res, next) => {
    Logger.info('Requesting account password update');
    try {
        const id = Number(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashedPassword);

        const userInformationData: any = {
            password: hashedPassword
        }

        const updatedUser = await usersService.update(id, userInformationData);

        return res.status(200).send(updatedUser);
    } catch (error: any) {
        Logger.error(error);
        res.status(error.status ? error.status : 500).json(error);
    }
});

/**
 * Mise à jour d'un utilisateur
 */
// 
UsersController.patch('/:id', AuthMiddlewares.verifyProfileOwnership, async (req, res, next) => {
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
        res.json(error);
    }
});

/**
 * Suppression d'un utilisateur
 */
UsersController.delete('/:id', AuthMiddlewares.verifyProfileOwnership, async (req, res, next) => {
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
        res.json(error);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { UsersController, usersService };

