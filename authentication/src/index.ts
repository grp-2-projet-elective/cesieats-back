import { ExceptionsHandler, LoggerService, UnknownRoutesHandler } from '@grp-2-projet-elective/cesieats-helpers';
import { AuthController } from 'controllers/auth.controller';
import cors from 'cors';
import 'dotenv/config';
import { environment } from 'environment/environment';
import express from 'express';
import { serve, setup } from "swagger-ui-express";

const outputFile = './swagger-output.json'

const Logger = LoggerService.Instance('Auth API', environment.logDir);

/**
 * On crée une nouvelle "application" express
 */
const app = express();
// const swaggerService = new SwaggerService(app, Logger, 'api/v1/auth/doc', outputFile);

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
app.use('/api/v1/auth', AuthController);
app.use('/api/v1/auth/doc', serve, setup(outputFile as any));

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
app.listen(environment.API_PORT, () => Logger.info(`Auth server listening at: http://localhost:${environment.API_PORT}`));