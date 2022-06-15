import { User, IUser } from 'models/users.model';
import { NotFoundException } from 'utils/exceptions';

export class UsersService {
    /**
     * Trouve tous les users
     */
    async findAll(): Promise<Array<IUser>> {
        try {
            const users = await User.find();

            return users;
        } catch (e) {
            throw new NotFoundException('No users found');
        }
    }

    /**
     * Trouve un user en particulier
     * @param id - ID unique de l'user
     */
    async findOne(id: string): Promise<IUser | null | undefined> {
        try {
            const user = await User.findById(id);

            return user;
        } catch (e) {
            throw new NotFoundException('No user found');
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
    async update(id: string, userData: Partial<IUser>): Promise<IUser | null | undefined> {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('No user found');
        }

        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });

        return updatedUser;
    }

    /**
     * Créé un user
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param userData - Un objet correspondant à un user. Attention, on ne prend pas l'id avec.
     */
    async create(userData: IUser): Promise<IUser> {
        const newUser: IUser = await User.create(userData);

        return newUser;
    }

    /**
     * Suppression d'un user
     */
    async delete(id: string) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('No user found');
        }

        await User.findByIdAndRemove(id);
    }
}
