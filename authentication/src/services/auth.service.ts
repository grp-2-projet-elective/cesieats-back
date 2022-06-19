import * as jwt from 'jsonwebtoken';
import { IUser, Tokens } from 'models/auth.models';
import { MqttClient } from 'mqtt';
import { Exception, InternalServerException } from 'utils/exceptions';

export class AuthService {
    public mqttClient: MqttClient;

    async register(userInformationData: Partial<IUser>): Promise<IUser | void> {
        try {
            this.mqttClient.publish('users', JSON.stringify({ action: 'create', data: userInformationData }), (err, packet) => {
                if (err) {
                    console.error(err);
                    throw new InternalServerException(err);
                }

                console.log(packet);
                const updatedUser = userInformationData as IUser;

                return updatedUser;
            });
        } catch (e) {
            throw new Exception(e.message, e.status);
        }
    }

    async login(id: string, username: string): Promise<Tokens | void> {
        try {
            //if user does not exist, send a 400 response
            const accessToken = this.generateAccessToken(username);
            const refreshToken = this.generateRefreshToken(username);

            this.mqttClient.publish('users', JSON.stringify({ action: 'updateToken', data: { accessToken: accessToken, refreshToken: refreshToken } }), (err, packet) => {
                if (err) {
                    console.error(err);
                    throw new InternalServerException(err);
                }

                console.log(packet);

                return { accessToken: accessToken, refreshToken: refreshToken };
            });

        } catch (e) {
            throw new Exception(e.message, e.status);
        }
    }

    async logout(id: string): Promise<void> {
        try {
            this.mqttClient.publish('users', JSON.stringify({ action: 'updateToken', userId: id, data: { accessToken: null, refreshToken: null } }), (err, packet) => {
                if (err) {
                    console.error(err);
                    throw new InternalServerException(err);
                }

                console.log(packet);
            });
        } catch (e) {
            throw new Exception(e.message, e.status);
        }
    }


    async refreshToken(id: string, mail: string, refreshToken: string): Promise<Tokens | void> {
        try {
            this.mqttClient.publish('users', JSON.stringify({ action: 'verifyRefreshToken', userId: id, data: { refreshToken: refreshToken } }), (err, packet) => {
                if (err) {
                    console.error(err);
                    throw new InternalServerException(err);
                }

                console.log(packet);
                // if (!refreshTokens.includes(req.body.token)) res.status(400).send("Refresh Token Invalid");
                // refreshTokens = refreshTokens.filter((c) => c != req.body.token);
                // const refreshToken = await service.findOne(req.body.tokenId);


                //remove the old refreshToken from the refreshTokens list
                const accessToken = this.generateAccessToken(mail);
                const refreshToken = this.generateRefreshToken(mail);

                return { accessToken: accessToken, refreshToken: refreshToken };
            });
        } catch (e) {
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
        return jwt.sign({ mail: mail }, process.env.ACCESS_TOKEN_SECRET as jwt.Secret, { expiresIn: "15m" });
    }

    /**
     * Génération d'un refresh token
     * @param mail 
     * @returns 
     */
    generateRefreshToken(mail: string): string {
        const refreshToken = jwt.sign({ mail: mail }, process.env.REFRESH_TOKEN_SECRET as jwt.Secret, { expiresIn: "20m" });
        // refreshTokens.push(refreshToken);
        return refreshToken;
    }
}
