import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { ExceptionsHandler } from 'middlewares/exceptions.handler';
import { UnknownRoutesHandler } from 'middlewares/unknown-routes.handler';
import { environment } from 'environment/environment';
import { connect } from 'mongoose';
import { MenusController } from 'controllers/menus.controller';
import { AuthMiddleware } from 'middlewares/auth.middleware';

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
app.use('/api/v1/menus', AuthMiddleware.isApiCall, AuthMiddleware.verifyAccessToken, MenusController);

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
app.listen(environment.API_PORT, () => console.log(`Server listening at: http://localhost:${environment.API_PORT}`));

try {
    (async () => {
        await connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PWD + environment.MONGO_URI);
        console.log('Connected to MongoDB');
    })();
} catch (error) {
    console.log('Error connecting to DB: ', error);
    process.exit(1);
}