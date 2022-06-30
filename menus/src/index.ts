import { AuthMiddlewares, ExceptionsHandler, LoggerService, UnknownRoutesHandler } from '@grp-2-projet-elective/cesieats-helpers';
import { MenusController } from 'controllers/menus.controller';
import cors from 'cors';
import 'dotenv/config';
import { environment } from 'environment/environment';
import express from 'express';
import { MenusAuthMiddleware } from 'middlewares/menus-auth.middleware';
import { connect } from 'mongoose';

const Logger: LoggerService = LoggerService.Instance('Menus API', environment.logDir);

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
app.use('/api/v1/menus', MenusAuthMiddleware.isApiCall, AuthMiddlewares.isCommercialDepartmentCall, AuthMiddlewares.isTechnicalDepartmentCall, AuthMiddlewares.verifyAccessToken, MenusController);

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
 * /!\ Cela doit être le dernier `app.use`
 */
app.use(ExceptionsHandler);

/**
 * On demande à Express d'écouter les requêtes sur le port défini dans la config
 */
app.listen(environment.API_PORT, () => Logger.info(`Server listening at: http://localhost:${environment.API_PORT}`));

try {
    (async () => {
        await connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PWD + environment.MONGO_URI);
        Logger.info('Connected to MongoDB');
    })();
} catch (error) {
    Logger.info('Error connecting to DB: ', error);
    process.exit(1);
}