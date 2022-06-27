import { environment } from "environment/environment";
import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize/types";
import { UsersService } from "./users.service";

export class SqlService {
    constructor(private readonly usersService: UsersService) { }

    public async initService(): Promise<void> {
        try {
            const sequelize = new Sequelize(`postgres://${process.env.SQL_USER}:${process.env.SQL_PWD}@${environment.SQL_SERVER}:${environment.SQL_PORT}/${environment.SQL_DATABASE}`);
            await sequelize.authenticate();

            const user = await this.syncUser(sequelize);
            const role = await this.syncRole(sequelize);

            this.usersService.User = user;
            this.usersService.Role = role;

            await this.populateRoles(role);

            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Error connecting to DB: ', error);
            process.exit(1);
        }
    }

    private async syncUser(sequelize: Sequelize): Promise<ModelStatic<Model<any, any>>> {
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
                primaryKey: true,
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
            zipCode: {
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
            referalCode: {
                type: DataTypes.STRING,
                allowNull: false
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

    private async syncRole(sequelize: Sequelize): Promise<ModelStatic<Model<any, any>>> {
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

    private async populateRoles(role: ModelStatic<Model<any, any>>): Promise<void> {
        const roleCount = await role.count();

        if (roleCount === 0) {
            console.log('No roles found, creating default roles...');

            const CUSTOMER = await role.create({
                type: 'CUSTOMER',
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            });

            const RESTAURANT_OWNER = await role.create({
                type: 'RESTAURANT_OWNER',
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            });

            const DELIVERY_MAN = await role.create({
                type: 'DELIVERY_MAN',
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            });

            const TECHNICAL_DEPARTMENT = await role.create({
                type: 'TECHNICAL_DEPARTMENT',
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            });

            const COMERCIAL_DEPARTMENT = await role.create({
                type: 'COMERCIAL_DEPARTMENT',
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            });

            await CUSTOMER.save();
            await RESTAURANT_OWNER.save();
            await DELIVERY_MAN.save();
            await TECHNICAL_DEPARTMENT.save();
            await COMERCIAL_DEPARTMENT.save();

            console.log('Roles succesfully created');
            return;
        }

        console.log('Roles already created');
    }
}