import { IUser, LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { User } from 'models/users.model';
import * as referralCodes from 'referral-codes';
import { Model, ModelStatic } from 'sequelize';

export class UsersService {

    private readonly Logger: LoggerService = LoggerService.Instance('Users API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/users');

    public User: ModelStatic<Model<any, any>>;
    public Role: ModelStatic<Model<any, any>>;

    private static instance: UsersService;

    constructor() {
        UsersService.instance = this;
    }

    /**
     * Trouve tous les users
     */
    async findAll(): Promise<Array<Model<any, any>>> {
        const users = await this.User.findAll();

        return users;
    }

    /**
     * Trouve un user en particulier
     * @param id - ID unique de l'user
     */
    async findOne(id: number): Promise<Model<any, any> | null> {
        const user = await this.User.findOne({ where: { id } });

        return user;
    }

    /**
     * Trouve un user en particulier par son email
     * @param mail - mail unique de l'user
     */
    async findOneByMail(mail: string): Promise<Model<any, any> | null> {
        const user = await this.User.findOne({ where: { mail } });

        return user;
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
        const user = await this.findOne(id);

        if (!user) throw new NotFoundException('No user found');;

        const updatedUser = {
            ...user.toJSON(),
            ...userData
        };

        await this.User.update(updatedUser, { where: { id } });
        this.Logger.info('User updated');

        return updatedUser;
    }

    /**
     * Créé un user
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param userData - Un objet correspondant à un user. Attention, on ne prend pas l'id avec.
     */
    async create(userData: IUser): Promise<Model<any, any>> {
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
    }

    /**
     * Suppression d'un user
     */
    async delete(id: number): Promise<any> {
        const userCount = await this.User.destroy({ where: { id } });

        if (userCount === 0) throw new NotFoundException('No user found');

        this.Logger.info('User deleted');
        return { message: 'User deleted' };
    }

    public static async isUserDuplicated(mail: string): Promise<boolean> {
        const user = await this.instance.findOneByMail(mail);
        if (user === null) return false;
        return true;
    }
}
