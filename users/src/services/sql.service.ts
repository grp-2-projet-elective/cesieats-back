import { LoggerService } from "@grp-2-projet-elective/cesieats-helpers";
import { environment } from "environment/environment";
import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import { UsersService } from "./users.service";

export class SqlService {

    private readonly Logger = LoggerService.Instance('Users API', environment.logDir);

    constructor(private readonly usersService: UsersService) { }

    /**
     * 
     */
    public async initService(): Promise<void> {
        this.Logger.info('Initializing SQL service');
        try {
            const sequelize = new Sequelize(`postgres://${process.env.SQL_USER}:${process.env.SQL_PWD}@${environment.SQL_SERVER}:${environment.SQL_PORT}/${environment.SQL_DATABASE}`);
            await sequelize.authenticate();

            const user = await this.syncUser(sequelize);
            const role = await this.syncRole(sequelize);

            this.usersService.User = user;
            this.usersService.Role = role;
            this.usersService.sequelize = sequelize;

            await this.populateRoles(role);

            this.Logger.info('Database connection successfully established');
        } catch (error) {
            this.Logger.fatal('Database connection error: ', error);
            process.exit(1);
        }
    }

    /**
     * 
     * @param sequelize 
     * @returns 
     */
    private async syncUser(sequelize: Sequelize): Promise<ModelStatic<Model<any, any>>> {
        try {
            this.Logger.info('Synchronizing Users table');
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
                isSuspended: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false
                },
                createdAt: DataTypes.DATE,
                updatedAt: DataTypes.DATE,
            });

            await user.sync();
            this.Logger.info('Users table synchronized');
            return user;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param sequelize 
     * @returns 
     */
    private async syncRole(sequelize: Sequelize): Promise<ModelStatic<Model<any, any>>> {
        this.Logger.info('Synchronizing Roles table');
        try {
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
            this.Logger.info('Users table synchronized');
            return role;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param role 
     * @returns 
     */
    private async populateRoles(role: ModelStatic<Model<any, any>>): Promise<void> {
        this.Logger.info('Roles creation');
        try {
            const roleCount = await role.count();

            if (roleCount === 0) {
                this.Logger.info('No roles found, creating default roles...');

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

                this.Logger.info('Roles succesfully created');
                return;
            }

            this.Logger.info('Roles already exists, skip process');
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }
}