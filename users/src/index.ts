import { AuthMiddlewares, ExceptionsHandler, LoggerService, UnknownRoutesHandler } from '@grp-2-projet-elective/cesieats-helpers';
import { UsersController, usersService } from 'controllers/users.controller';
import cors from 'cors';
import 'dotenv/config';
import { environment } from 'environment/environment';
import express from 'express';
import { UsersAuthMiddleware } from 'middlewares/users-auth.middleware';
import { SqlService } from 'services/sql.service';

const Logger: LoggerService = LoggerService.Instance('Users API', environment.logDir);

/**
 * On crée une nouvelle "application" express
 */
const app = express();

/**
 * On dit à Express que l'on souhaite parser le body des requêtes en JSON
 *
 * @example app.post('/', (req) => req.body.prop)
 */
app.use(express.json());

/**
 * On dit à Express que l'on souhaite autoriser tous les noms de domaines
 * à faire des requêtes sur notre API.
 */
app.use(cors());

/**
 * Toutes les routes CRUD pour les animaux seront préfixées par `/pets`
 */
// AuthMiddlewares.isCommercialDepartmentCall, AuthMiddlewares.isTechnicalDepartmentCall,
// 
// 
app.use('/api/v1/users', UsersAuthMiddleware.isApiCall, AuthMiddlewares.verifyAccessToken, UsersController);

/**
 * Homepage (uniquement nécessaire pour cette demo)
 */
app.get('/', (req, res) => res.send(`Server listening at: http://localhost:${environment.API_PORT}`));

/**
 * Pour toutes les autres routes non définies, on retourne une erreur
 */
app.all('*', UnknownRoutesHandler);

/**
 * Gestion des erreurs
 */
app.use(ExceptionsHandler);

(async () => {
    const sqlService = new SqlService(usersService);
    await sqlService.initService();

    /**
     * On demande à Express d'écouter les requêtes sur le port défini dans la config
     */
    app.listen(environment.API_PORT, () => Logger.info(`Server listening at: http://localhost:${environment.API_PORT}`));
})();