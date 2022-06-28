import { IUser, LoggerService, NotFoundException, Roles } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { User, UsersStats } from 'models/users.model';
import * as referralCodes from 'referral-codes';
import { Model, ModelStatic, Sequelize } from 'sequelize';

export class UsersService {

    private readonly Logger: LoggerService = LoggerService.Instance('Users API', environment.logDir);

    public User: ModelStatic<Model<any, any>>;
    public Role: ModelStatic<Model<any, any>>;
    public sequelize: Sequelize;

    private static instance: UsersService;

    constructor() {
        UsersService.instance = this;
    }

    /**
     * Trouve tous les users
     */
    async findAll(): Promise<Array<Model<any, any>>> {
        try {
            const users = await this.User.findAll();

            return users;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Trouve un user en particulier
     * @param id - ID unique de l'user
     */
    async findOne(id: number): Promise<Model<any, any> | null> {
        try {
            const user = await this.User.findOne({ where: { id } });

            return user;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Trouve un user en particulier par son email
     * @param mail - mail unique de l'user
     */
    async findOneByMail(mail: string): Promise<Model<any, any> | null> {
        try {
            const user = await this.User.findOne({ where: { mail } });

            return user;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Met à jour un user en particulier
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param userData - Un objet correspondant à un user, il ne contient pas forcément tout un user. Attention, on ne prend pas l'id avec.
     * @param id - ID unique de l'user
     */
    async update(id: number, userData: Partial<User>): Promise<Model<any, any> | null> {
        try {
            const user = await this.findOne(id);

            if (!user) throw new NotFoundException('No user found');;

            const updatedUser = {
                ...user.toJSON(),
                ...userData
            };

            await this.User.update(updatedUser, { where: { id } });
            this.Logger.info('User updated');

            return updatedUser;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Créé un user
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param userData - Un objet correspondant à un user. Attention, on ne prend pas l'id avec.
     */
    async create(userData: IUser): Promise<Model<any, any>> {
        try {
            const newUser = await this.User.create({
                ...userData,
                referalCode: referralCodes.generate({
                    prefix: `${userData.roleId}-`,
                    pattern: '###-###',
                    length: 6,
                    count: 1,
                    charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                })[0],
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            });

            await newUser.save();
            this.Logger.info('User created');
            return newUser;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Suppression d'un user
     */
    async delete(id: number): Promise<any> {
        try {
            const userCount = await this.User.destroy({ where: { id } });

            if (userCount === 0) throw new NotFoundException('No user found');

            this.Logger.info('User deleted');
            return { message: 'User deleted' };
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    public async getStats(): Promise<UsersStats | void> {
        try {
            const usersCount = await this.User.count();

            const customersCount = await this.User.count({ where: { roleId: Roles.CUSTOMER } });
            const restaurantOwnersCount = await this.User.count({ where: { roleId: Roles.RESTAURANT_OWNER } });
            const deliveryMansCount = await this.User.count({ where: { roleId: Roles.DELIVERY_MAN } });
            const technicalDepartmentCount = await this.User.count({ where: { roleId: Roles.TECHNICAL_DEPARTMENT } });
            const comercialDepartmentsCount = await this.User.count({ where: { roleId: Roles.COMERCIAL_DEPARTMENT } });
            const externalsCount = await this.User.count({ where: { roleId: Roles.EXTERNAL } });

            const citiesCount: number = await this.User.aggregate('zipCode', 'count');

            return {
                usersCount,
                customersCount,
                restaurantOwnersCount,
                deliveryMansCount,
                technicalDepartmentCount,
                comercialDepartmentsCount,
                externalsCount,
                citiesCount
            }
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    public static async isUserDuplicated(mail: string): Promise<boolean> {
        try {
            const user = await this.instance.findOneByMail(mail);
            if (user === null) return false;
            return true;
        } catch (error) {
            UsersService.instance.Logger.error(error);
            throw error;
        }
    }
}
