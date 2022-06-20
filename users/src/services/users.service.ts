import { EsbService, RequestMessage } from '@grp-2-projet-elective/mqtt-helper';
import { IUser, Role, Roles, User } from 'models/users.model';
import { Model, ModelStatic } from 'sequelize/types';
import { Exception, NotFoundException } from 'utils/exceptions';

export class UsersService {
    public User: ModelStatic<Model<any, any>>;
    public Role: ModelStatic<Model<any, any>>;

    constructor(private readonly esbService: EsbService) {
        console.log(this.esbService.isMqttClientConnected);
        this.esbService.eventEmitter.on('requestEvent/users/findOneByMail', (data: RequestMessage) => {
            console.log('requestEvent/users/findOneByMail');
            console.log(data);
        });

        this.esbService.eventEmitter.on('requestEvent/users/findOne', (data: RequestMessage) => {
            console.log('requestEvent/users/findOne');
            console.log(data);
        });

        this.esbService.eventEmitter.on('requestEvent/users/createOne', (data: RequestMessage) => {
            console.log('requestEvent/users/createOne');
            const parsedPayload = JSON.parse(data.payload.toString());
            this.create(parsedPayload.userInformationData, Roles.CUSTOMER);
        });
    }

    /**
     * Trouve tous les users
     */
    async findAll(): Promise<Array<Model<any, any>>> {
        try {
            const users = await this.User.findAll();

            return users;
        } catch (e: any) {
            throw new Exception(e.message, e.status);
        }
    }

    /**
     * Trouve un user en particulier
     * @param id - ID unique de l'user
     */
    async findOne(id: string): Promise<Model<any, any>> {
        try {
            const user = await this.User.findOne({ where: { id } });

            if (!user) {
                throw new NotFoundException('No user found');
            }

            return user;
        } catch (e: any) {
            throw new Exception(e.message, e.status);
        }
    }

    /**
     * Trouve un user en particulier
     * @param id - ID unique de l'user
     */
    async findOneByMail(mail: string): Promise<Model<any, any>> {
        try {
            const user = await this.User.findOne({ where: { mail } });

            if (!user) {
                throw new NotFoundException('No user found');
            }

            return user;
        } catch (e: any) {
            throw new Exception(e.message, e.status);
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
    async update(id: string, userData: Partial<User>): Promise<Model<any, any> | null> {
        try {
            const user = await this.findOne(id);

            const updatedUser = {
                ...user.toJSON(),
                ...userData
            };

            await this.User.update(updatedUser, { where: { id } });

            return updatedUser;
        } catch (e: any) {
            throw new Exception(e.message, e.status);
        }
    }

    /**
     * Créé un user
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param userData - Un objet correspondant à un user. Attention, on ne prend pas l'id avec.
     */
    async create(userData: IUser, role: Roles): Promise<Model<any, any>> {
        const newUser = await this.User.create({
            ...userData,
            roleId: (await this.Role.findOne({ where: { type: role } }) as Role).id,
            createdAt: new Date(Date.now()),
            updatedAt: new Date(Date.now()),
        });

        await newUser.save();
        return newUser;
    }

    /**
     * Suppression d'un user
     */
    async delete(id: string): Promise<any> {
        try {
            const userCount = await this.User.destroy({ where: { id } });

            if (userCount === 0) {
                throw new NotFoundException('No user found');
            }

            return { message: 'User deleted' };
        } catch (e: any) {
            throw new Exception(e.message, e.status);
        }
    }
}
