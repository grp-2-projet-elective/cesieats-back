import { NotFoundException } from 'utils/exceptions';
import * as jwt from 'jsonwebtoken';
import { IUserInformation, UserInformation } from 'models/auth.models';

export class AuthService {

    /**
     * Trouve un user en particulier
     * @param id - ID unique de l'user
     */
    async findOne(id: string): Promise<IUserInformation | null | undefined> {
        try {
            const user = await UserInformation.findById(id);

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
    async login(id: string, userInformationData: Partial<IUserInformation>): Promise<IUserInformation | null | undefined> {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('No user found');
        }

        const updatedUser = await UserInformation.findByIdAndUpdate(id, userInformationData, { new: true });

        return updatedUser;
    }
    
    async register(id: string, userInformationData: Partial<IUserInformation>): Promise<IUserInformation | null | undefined> {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('No user found');
        }

        const updatedUser = await UserInformation.findByIdAndUpdate(id, userInformationData, { new: true });

        return updatedUser;
    }

    /**
     * Suppression d'un user
     */
    async logout(id: string) {
        const user = await this.findOne(id);

        if (!user) {
            throw new NotFoundException('No user found');
        }

        await UserInformation.findByIdAndRemove(id);
    }


    // accessTokens
    generateAccessToken(username: string): string {
        return jwt.sign({ username: username }, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, { expiresIn: "15m" });
    }

    // refreshTokens
    generateRefreshToken(username: string): string {
        const refreshToken = jwt.sign({ username: username }, process.env.REFRESH_TOKEN_SECRET as jwt.Secret, { expiresIn: "20m" });
        // refreshTokens.push(refreshToken);
        return refreshToken;
    }
}
