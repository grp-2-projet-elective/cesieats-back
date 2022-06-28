import { BadRequestException, IUser, LoggerService, NotFoundException, Roles, UnauthorizedException } from '@grp-2-projet-elective/cesieats-helpers';
import axios from 'axios';
import * as bcrypt from 'bcrypt';
import { environment } from 'environment/environment';
import * as jwt from 'jsonwebtoken';
import { TokenData, Tokens } from 'models/auth.model';

export class AuthService {

    private readonly Logger: LoggerService = LoggerService.Instance('Auth API', environment.logDir);

    constructor() { }

    public async register(userInformationData: Partial<IUser>): Promise<IUser | void> {
        try {
            const user = await this.createUser(userInformationData);

            this.Logger.info('New account registered');
            return user;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    public async login(mail: string, password: string): Promise<Tokens | { status: number, message: string, [key: string]: any }> {
        try {
            const user = await this.getUserByMail(mail);

            if (!user) throw new NotFoundException('No user found');
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

                this.Logger.info('Account logged in');
                return { accessToken: accessToken, refreshToken: refreshToken };
            }

            throw new UnauthorizedException('Unauthorized');
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    public async logout(mail: string): Promise<any> {
        try {
            const user = await this.getUserByMail(mail);
            user.refreshToken = undefined;

            await this.updateUser(user);

            this.Logger.info('Account logged out');
            return { status: 204, message: 'Disconnected' };
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    public async refreshToken(mail: string, refreshToken: string): Promise<Tokens | void> {
        try {
            const user = await this.getUserByMail(mail);

            if (user.refreshToken != refreshToken) throw new BadRequestException('Refresh Token Invalid');

            const tokenData: TokenData = {
                id: user.id,
                mail: user.mail,
                role: user.role,
                restaurantId: user.role === Roles.RESTAURANT_OWNER ? 0 : undefined
            };

            const newAccessToken = this.generateAccessToken(tokenData);
            const newRefreshToken = this.generateRefreshToken(tokenData);

            this.Logger.info('Account token refreshed');
            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            this.Logger.error(error);
            throw error;
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
        this.Logger.info('Users api request: requesting user by mail');
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/${mail}`;

            const user = (await axios.get(apiUrl)).data;
            return user;
        } catch (error: any) {
            this.Logger.error(error);
            throw error?.response?.data ? error?.response?.data : error;
        }
    }

    public async createUser(userInformationData: Partial<IUser>): Promise<IUser> {
        this.Logger.info('Users api request: requesting user creation');
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users`;
            const body = {
                ...userInformationData
            }

            const user = (await axios.post(apiUrl, body)).data;

            return user as any;
        } catch (error: any) {
            this.Logger.error(error);
            throw error?.response?.data ? error?.response?.data : error;
        }
    }

    public async updateUser(userInformationData: Partial<IUser>): Promise<IUser> {
        this.Logger.info('Users api request: requesting user update');
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/${userInformationData.mail}`;
            const body = {
                ...userInformationData
            }

            const user = (await axios.patch(apiUrl, body)).data;

            return user as any;
        } catch (error: any) {
            this.Logger.error(error);
            throw error?.response?.data ? error?.response?.data : error;
        }
    }
}
