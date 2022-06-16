import { UsersController } from 'controllers/users.controller';
import { DataTypes, Sequelize } from 'sequelize';
import cors from 'cors';
import 'dotenv/config';
import { environment } from 'environment/environment';
import express from 'express';
import { AuthMiddleware } from 'middlewares/auth.middleware';
import { ExceptionsHandler } from 'middlewares/exceptions.handler';
import { UnknownRoutesHandler } from 'middlewares/unknown-routes.handler';
import { User } from 'models/users.model';

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
app.use('/api/v1/users', AuthMiddleware.verifyAccessToken, UsersController);

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

(async () => {
    try {
        const sequelize = new Sequelize(`postgres://${process.env.SQL_USER}:${process.env.SQL_PWD}@${environment.SQL_SERVER}:${environment.SQL_PORT}/${environment.SQL_DATABASE}`);
        await sequelize.authenticate();

        User.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true
                },
                username: {
                    type: new DataTypes.STRING(128),
                    allowNull: false
                },
                firstname: {
                    type: new DataTypes.STRING(128),
                    allowNull: true
                },
                lastname: {
                    type: new DataTypes.STRING(128),
                    allowNull: true
                },
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE,
            },
            {
                tableName: 'users',
                sequelize // passing the `sequelize` instance is required
            }
        );

        User.create({
            username: 'admin',
            firstname: 'Admin',
            lastname: 'Admin'
        });
        
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Error connecting to DB: ', error);
        process.exit(1);
    }
})();