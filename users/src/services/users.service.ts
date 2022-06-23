import { IUser, Roles, User } from 'models/users.model';
import { Model, ModelStatic } from 'sequelize/types';
import { Exception, NotFoundException } from 'utils/exceptions';
import * as referralCodes from 'referral-codes';

export class UsersService {
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
        try {
            const users = await this.User.findAll();

            return users;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    /**
     * Trouve un user en particulier
     * @param id - ID unique de l'user
     */
    async findOne(mail: string): Promise<Model<any, any> | null> {
        try {
            const user = await this.User.findOne({ where: { mail } });

            return user;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    /**
     * Trouve un user en particulier par son email
     * @param mail - mail unique de l'user
     */
    async findOneById(id: string): Promise<Model<any, any> | null> {
        try {
            const user = await this.User.findOne({ where: { id } });

            return user;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    /**
     * Trouve un user en particulier par son email
     * @param mail - mail unique de l'user
     */
    async asRole(mail: string, role: Roles): Promise<boolean> {
        try {
            const user: User = await this.User.findOne({ where: { mail } }) as User;

            if (!user) {
                throw new NotFoundException('No user found');
            }

            return user.roleId === role ? true : false;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
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
    async update(mail: string, userData: Partial<User>): Promise<Model<any, any> | null> {
        try {
            const user = await this.findOne(mail);

            if (!user) return null;

            const updatedUser = {
                ...user.toJSON(),
                ...userData
            };

            await this.User.update(updatedUser, { where: { mail } });

            return updatedUser;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
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
                    length: 8,
                    count: 1,
                    charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                })[0],
                createdAt: new Date(Date.now()),
                updatedAt: new Date(Date.now()),
            });

            await newUser.save();
            return newUser;
        } catch (e: any) {
            throw new Exception(e, e.status);
        }
    }

    /**
     * Suppression d'un user
     */
    async delete(mail: string): Promise<any> {
        try {
            const userCount = await this.User.destroy({ where: { mail } });

            if (userCount === 0) {
                throw new NotFoundException('No user found');
            }

            return { message: 'User deleted' };
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public static async asRole(mail: string, role: Roles): Promise<boolean> {
        try {
            const user = await this.instance.asRole(mail, role);
            if (user === null) return false;
            return true;
        } catch (e: any) {
            throw new Exception(e, e.status ? e.status : 500);
        }
    }

    public static async isUserDuplicated(mail: string): Promise<boolean> {
        try {
            const user = await this.instance.findOne(mail);
            if (user === null) return false;
            return true;
        } catch (e: any) {
            throw new Exception(e, e.status ? e.status : 500);
        }
    }
}
