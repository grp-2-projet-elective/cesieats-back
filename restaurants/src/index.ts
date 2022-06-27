import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { environment } from 'environment/environment';
import { connect } from 'mongoose';
import { RestaurantsController } from 'controllers/restaurants.controller';
import { RestaurantAuthMiddleware } from 'middlewares/restaurant-auth.middleware';
import { AuthMiddlewares, ExceptionsHandler, UnknownRoutesHandler } from '@grp-2-projet-elective/cesieats-helpers';

/**middlewares/restaurant-auth.middleware
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
app.use('/api/v1/restaurants', RestaurantAuthMiddleware.isApiCall, AuthMiddlewares.verifyAccessToken, RestaurantsController);

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