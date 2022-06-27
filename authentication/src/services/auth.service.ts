import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { environment } from 'environment/environment';
import * as jwt from 'jsonwebtoken';
import { IUser, TokenData, Tokens } from 'models/auth.model';
import { Roles } from 'models/users.model';
import { Exception } from 'utils/exceptions';

export class AuthService {
    private static instance: AuthService;

    constructor() {
        AuthService.instance = this;
    }

    public async register(userInformationData: Partial<IUser>): Promise<IUser | void> {
        const user = await this.createUser(userInformationData);

        return user;
    }

    public async login(mail: string, password: string): Promise<Tokens | { status: number, message: string, [key: string]: any }> {
        try {
            const user = await this.getUserByMail(mail);

            if (!user) return { status: 404, message: 'No user found' };
            const hashComparaison = await bcrypt.compare(password, user.password);

            if (hashComparaison) {
                const tokenData: TokenData = {
                    id: user.id,
                    mail: user.mail,
                    role: user.role,
                    restaurantId: user.role === Roles.RESTAURANT_OWNER ? 0 : undefined
                };

                const accessToken = this.generateAccessToken(tokenData);
                const refreshToken = this.generateRefreshToken(tokenData);

                const updatedUser = {
                    ...user,
                    accessToken,
                    refreshToken
                };

                await this.updateUser(updatedUser);

                return { accessToken: accessToken, refreshToken: refreshToken };
            }

            return { status: 403, message: 'Unauthorized' };
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public async logout(mail: string): Promise<any> {
        try {
            const user = await this.getUserByMail(mail);
            user.refreshToken = undefined;

            await this.updateUser(user);

            return { status: 200, message: 'disconnected' };
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public async refreshToken(mail: string, refreshToken: string): Promise<Tokens | void> {
        try {
            const user = await this.getUserByMail(mail);

            if (user.refreshToken != refreshToken) throw new Exception('Refresh Token Invalid', 400);

            const tokenData: TokenData = {
                id: user.id,
                mail: user.mail,
                role: user.role,
                restaurantId: user.role === Roles.RESTAURANT_OWNER ? 0 : undefined
            };

            const newAccessToken = this.generateAccessToken(tokenData);
            const newRefreshToken = this.generateRefreshToken(tokenData);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (e: any) {
            console.error(e)
            throw new Exception(e.error, e.status);
        }
    }

    /**
     * Génération d'un access token
     * 
     * @param tokenData 
     * @returns 
     */
    generateAccessToken(tokenData: TokenData): string {
        return jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, { expiresIn: '15m' });
    }

    /**
     * Génération d'un refresh token
     * @param tokenData 
     * @returns 
     */
    generateRefreshToken(tokenData: TokenData): string {
        return jwt.sign(tokenData, process.env.REFRESH_TOKEN_SECRET as jwt.Secret, { expiresIn: '20m' });
    }

    public async getUserByMail(mail: string): Promise<any> {
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/${mail}`;

            const user = (await axios.get(apiUrl)).data;
            return user;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public async asRole(mail: string, role: Roles): Promise<boolean> {
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/asRole/${mail}/${role}`;

            const asRole = ((await axios.get(apiUrl))).data as boolean;
            return asRole;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public async createUser(userInformationData: Partial<IUser>): Promise<IUser> {
        const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users`;
        const body = {
            ...userInformationData
        }

        const user = (await axios.post(apiUrl, body)).data;

        return user as any;
    }

    public async updateUser(userInformationData: Partial<IUser>): Promise<IUser> {
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/${userInformationData.mail}`;
            const body = {
                ...userInformationData
            }

            const user = (await axios.patch(apiUrl, body)).data;

            return user as any;
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
}
