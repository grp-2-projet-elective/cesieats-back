import { Tokens } from '@grp-2-projet-elective/auth-helper';
import { EsbService, publishWithResponseBasic } from '@grp-2-projet-elective/mqtt-helper';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { IUser } from 'models/auth.model';
import { IClientPublishOptions } from 'mqtt';
import { Exception } from 'utils/exceptions';

export class AuthService {
    // private readonly mqttClient: MqttClient,
    constructor(public readonly esbService: EsbService) {
        console.log(this.esbService.isMqttClientConnected);
        // this.esbService.eventEmitter.on('responseEvent/users/findOneByMail', (data: any) => {
        //     console.log('responseEvent/users/findOneByMail');
        //     console.log(data);
        // });

        // this.esbService.eventEmitter.on('responseEvent/users/findOne', (data: any) => {
        //     console.log('responseEvent/users/findOne');
        //     console.log(data);
        // });

        // this.esbService.eventEmitter.on('responseEvent/users/createOne', (data: any) => {
        //     console.log('responseEvent/users/createOne');
        //     const parsedMessage = JSON.parse(data.message);
        //     console.log(parsedMessage.payload);
        // });
    }

    async register(userInformationData: Partial<IUser>): Promise<IUser | void> {
        try {
            const user = await this.createUser(userInformationData);

            return user;
        } catch (e: any) {
            throw new Exception(e.message, e.status);
        }
    }

    async login(id: string, username: string, hashedPassword: string): Promise<Tokens | void> {
        try {
            const user = await this.getUser(id);

            if (await bcrypt.compare(hashedPassword, user.password)) {
                //if user does not exist, send a 400 response
                const accessToken = this.generateAccessToken(username);
                const refreshToken = this.generateRefreshToken(username);

                return { accessToken: accessToken, refreshToken: refreshToken };
            }
        } catch (e: any) {
            throw new Exception(e.message, e.status);
        }
    }

    async logout(id: string): Promise<void> {
        try {

        } catch (e: any) {
            throw new Exception(e.message, e.status);
        }
    }


    async refreshToken(mail: string, refreshToken: string): Promise<Tokens | void> {
        try {
            const user = await this.getUserByMail(mail);

            if (user.refreshToken != refreshToken) throw new Exception('Refresh Token Invalid', 400);
            // refreshTokens = refreshTokens.filter((c) => c != req.body.token);


            //remove the old refreshToken from the refreshTokens list
            const newAccessToken = this.generateAccessToken(mail);
            const newRefreshToken = this.generateRefreshToken(mail);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (e: any) {
            throw new Exception(e.message, e.status);
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

    private async getUser(id: string): Promise<IUser> {
        const apiName: string = 'users';
        const action: string = 'findOne';
        const responseTopic = `response/${apiName}/${action}`;
        const requestTopic = `request/${apiName}/${action}`;
        const publishOptions: IClientPublishOptions = {
            qos: 1,
            properties: {
                responseTopic,
                correlationData: Buffer.from('secret', 'utf-8'),
            },
        };

        const payload = JSON.stringify({
            userId: id,
        });

        const user = JSON.parse(await publishWithResponseBasic(this.esbService.mqttClient, payload, publishOptions, requestTopic, responseTopic));
        console.log(user);

        return user;
    }

    private async getUserByMail(mail: string): Promise<IUser> {        
        const apiName: string = 'users';
        const action: string = 'findOneByMail';

        const payload = JSON.stringify({
            mail
        });

        const user = (await this.esbService.call(apiName, action, payload));
        console.log(user);

        return user as any;
    }

    private async createUser(userInformationData: Partial<IUser>): Promise<IUser> {
        const apiName: string = 'users';
        const action: string = 'createOne';

        const payload = JSON.stringify({
            userInformationData
        });

        const user = (await this.esbService.call(apiName, action, payload));
        console.log(user);

        return user as any;
    }
}
