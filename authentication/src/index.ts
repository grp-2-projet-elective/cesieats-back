import { AuthController, initMqttAuthListening } from 'controllers/auth.controller';
import cors from 'cors';
import dotenv from 'dotenv';
import { environment } from 'environment/environment';
import express from 'express';
import { ExceptionsHandler } from 'middlewares/exceptions.handler';
import { UnknownRoutesHandler } from 'middlewares/unknown-routes.handler';

import * as mqtt from "mqtt";

dotenv.config();

/**
 * On crée une nouvelle "application" express
 */
const app = express();
const client: mqtt.MqttClient = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
    client.subscribe('authentication', function (err: any) {
        if (!err) {
            console.log('Authentication topic subscribed');
            initMqttAuthListening(client);
            // client.publish('authentication', 'Auth request');
            return;
        }

        console.error(err);
    });
});

// client.on('message', function (topic, message) {
//     // message is Buffer
//     console.log(topic);
//     console.log(message.toString());
// });

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
app.use('/api/v1/users', AuthController);

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
app.listen(environment.API_PORT, () => console.log(`Auth server listening at: http://localhost:${environment.API_PORT}`));

// try {
//     (async () => {
//         await connect('mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PWD + environment.MONGO_URI);
//         console.log('Connected to MongoDB');
//     })();
// } catch (error) {
//     console.log('Error connecting to DB: ', error);
//     process.exit(1);
// }