import { UsersController, usersService } from 'controllers/users.controller';
import cors from 'cors';
import 'dotenv/config';
import { environment } from 'environment/environment';
import express from 'express';
import { ExceptionsHandler } from 'middlewares/exceptions.handler';
import { UnknownRoutesHandler } from 'middlewares/unknown-routes.handler';
import { Roles } from 'models/users.model';
import { DataTypes, Model, ModelStatic, Sequelize } from 'sequelize';

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
app.use('/api/v1/users', UsersController);
// app.use('/api/v1/users', AuthMiddleware.verifyAccessToken, UsersController);

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

(async () => {
    try {
        const sequelize = new Sequelize(`postgres://${process.env.SQL_USER}:${process.env.SQL_PWD}@${environment.SQL_SERVER}:${environment.SQL_PORT}/${environment.SQL_DATABASE}`);
        await sequelize.authenticate();

        const user = await syncUser(sequelize);
        const role = await syncRole(sequelize);

        usersService.User = user;
        usersService.Role = role;

        await populateRoles(role);

        console.log('Connection has been established successfully.');

        /**
         * On demande à Express d'écouter les requêtes sur le port défini dans la config
         */
        app.listen(environment.API_PORT, () => console.log(`Server listening at: http://localhost:${environment.API_PORT}`));
    } catch (error) {
        console.error('Error connecting to DB: ', error);
        process.exit(1);
    }
})();

async function syncUser(sequelize: Sequelize): Promise<ModelStatic<Model<any, any>>> {
    const user = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        mail: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        thumbnail: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        cityCode: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        sponsorId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    });

    await user.sync();
    return user;
}

async function syncRole(sequelize: Sequelize): Promise<ModelStatic<Model<any, any>>> {
    const role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
    });

    await role.sync();
    return role;
}

async function populateRoles(role: ModelStatic<Model<any, any>>): Promise<void> {
    const roleCount = await role.count();

    if (roleCount === 0) {
        console.log('No roles found, creating default roles...');

        const CUSTOMER = await role.create({
            type: Roles.CUSTOMER,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        });

        const RESTAURANT_OWNER = await role.create({
            type: Roles.RESTAURANT_OWNER,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        });

        const DELIVERY_MAN = await role.create({
            type: Roles.DELIVERY_MAN,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        });

        const TECHNICAL_DEPARTMENT = await role.create({
            type: Roles.TECHNICAL_DEPARTMENT,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        });

        const COMERCIAL_DEPARTMENT = await role.create({
            type: Roles.COMERCIAL_DEPARTMENT,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        });

        await CUSTOMER.save();
        await RESTAURANT_OWNER.save();
        await DELIVERY_MAN.save();
        await TECHNICAL_DEPARTMENT.save();
        await COMERCIAL_DEPARTMENT.save();
    }

    console.log('Roles already created');
}