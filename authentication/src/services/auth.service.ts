import axios from 'axios';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser, Tokens } from 'models/auth.model';
import { Roles } from 'models/user.model';
import { Exception } from 'utils/exceptions';

export class AuthService {
    private static instance: AuthService;

    constructor() {
        AuthService.instance = this;
    }

    async register(userInformationData: Partial<IUser>): Promise<IUser | void> {
        try {
            const user = await this.createUser(userInformationData);

            return user;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    async login(mail: string, password: string): Promise<Tokens | { status: number, message: string, [key: string]: any }> {
        try {
            const user = await this.getUserByMail(mail);

            if (!user) return { status: 404, message: 'No user found' };
            const hashComparaison = await bcrypt.compare(password, user.password);

            if (hashComparaison) {
                const accessToken = this.generateAccessToken(mail);
                const refreshToken = this.generateRefreshToken(mail);

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

    async logout(id: string): Promise<void> {
        try {

        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }


    async refreshToken(mail: string, refreshToken: string): Promise<Tokens | void> {
        try {
            const user = await this.getUserByMail(mail);

            if (user.refreshToken != refreshToken) throw new Exception('Refresh Token Invalid', 400);

            //remove the old refreshToken from the refreshTokens list
            const newAccessToken = this.generateAccessToken(mail);
            const newRefreshToken = this.generateRefreshToken(mail);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (e: any) {
            console.error(e)
            throw new Exception(e.error, e.status);
        }
    }

    /**
     * Génération d'un access token
     * 
     * @param mail 
     * @returns 
     */
    generateAccessToken(mail: string): string {
        return jwt.sign({ mail: mail }, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, { expiresIn: '15m' });
    }

    /**
     * Génération d'un refresh token
     * @param mail 
     * @returns 
     */
    generateRefreshToken(mail: string): string {
        const refreshToken = jwt.sign({ mail: mail }, process.env.REFRESH_TOKEN_SECRET as jwt.Secret, { expiresIn: '20m' });
        // refreshTokens.push(refreshToken);
        return refreshToken;
    }

    public async getUserByMail(mail: string): Promise<any> {
        try {
            const apiUrl: string = `http://localhost:3030/api/v1/users/${mail}`;

            const user = (await axios.get(apiUrl)).data;
            return user;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public async asRole(mail: string, role: Roles): Promise<boolean> {
        try {
            const apiUrl: string = 'http://localhost:3030/api/v1/users/asRole';
            const body: any = {
                mail,
                role
            }

            const asRole = ((await axios.get(apiUrl, body))).data as boolean;
            return asRole;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public async createUser(userInformationData: Partial<IUser>): Promise<IUser> {
        const apiUrl: string = 'http://localhost:3030/api/v1/users';
        const body = {
            ...userInformationData
        }

        const user = (await axios.post(apiUrl, body)).data;

        return user as any;
    }

    public async updateUser(userInformationData: Partial<IUser>): Promise<IUser> {
        try {
            const apiUrl: string = `http://localhost:3030/api/v1/users/${userInformationData.mail}`;
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

    public static async isUserDuplicated(mail: string): Promise<boolean> {
        try {
            const user = await this.instance.getUserByMail(mail);
            if (user === null) return false;
            return true;
        } catch (e: any) {
            throw new Exception(e, e.status ? e.status : 500);
        }
    }
}
