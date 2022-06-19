
import { IErrorCallback, IPayload } from "models/esb.model";
import { MqttClient } from "mqtt";
import { Subject } from "rxjs";
import { AuthService } from "./auth.service";

export class EsbService {
    public readonly isMqttClientConnected: boolean = false;
    public readonly responseSubject: Subject<IPayload> = new Subject<IPayload>();

    constructor(private readonly mqttClient: MqttClient, public readonly topics: Array<string>, public readonly service: AuthService) { }

    public initEsbService() {
        this.mqttClient.on('connect', () => {
            this.mqttClient.connected = true;

            this.mqttClient.subscribe(['auth', 'users-response'], (err: Error) => {
                if (!err) {
                    this.initEsbMessagesListening();
                    console.log('ESB topics subscribed');
                    return;
                }

                console.error(err);
            });
        });

        this.mqttClient.on("error", (err: IErrorCallback) => {
            console.log("Error: " + err);

            if (err.code == "ENOTFOUND") {
                console.log("Network error, make sure you have an active internet connection");
            }
        });

        this.mqttClient.on("close", () => {
            this.mqttClient.connected = false;
            console.log("Connection closed by client");
        });

        this.mqttClient.on("reconnect", () => {
            this.mqttClient.connected = true;
            console.log("Client trying a reconnection");
        });

        this.mqttClient.on("offline", () => {
            this.mqttClient.connected = false;
            console.log("Client is currently offline");
        });
    }

    private initEsbMessagesListening(): void {
        this.mqttClient.on('message', async (topic: string, message: string) => {
            // message is Buffer
            console.log(topic);
            console.log(message.toString());

            await ({
                'auth': async (message: string) => {
                    const payload: IPayload = JSON.parse(message);

                    ({
                        'register': async () => {
                            await this.service.register(payload.body.userInformationData);

                            const responsePayload = {
                                id: payload.id,
                                action: 'findAll-response',
                                message: 'User registered'
                            };

                            this.mqttClient.publish('auth-response', JSON.stringify(responsePayload));
                        },
                        'login': async () => {
                            await this.service.login(payload.body.userId, payload.body.username, payload.body.password);

                            const responsePayload = {
                                id: payload.id,
                                action: 'findOne-response',
                                message: 'User logged in'
                            };

                            this.mqttClient.publish('auth-response', JSON.stringify(responsePayload));
                        },
                        'logout': async () => {
                            const createdUser = await this.service.create(payload.body.userData, payload.body.role);

                            const responsePayload = {
                                id: payload.id,
                                action: 'create-response',
                                createdUser: createdUser
                            };

                            this.mqttClient.publish('auth-response', JSON.stringify(responsePayload));
                        },
                        'refreshToken': async () => {
                            const updatedUser = await this.service.update(payload.body.userId, payload.body.userData);

                            const responsePayload = {
                                id: payload.id,
                                action: 'update-response',
                                updatedUser: updatedUser
                            };

                            this.mqttClient.publish('auth-response', JSON.stringify(responsePayload));
                        }
                    }[payload.action])();
                },
                'users-response': async (message: string) => {
                    const payload: IPayload = JSON.parse(message);

                    ({
                        'findAll': async () => {
                            // const users = await this.service.findAll();
                        },
                        'findOne': async () => {
                            // const user = await this.service.findOne(payload.body.userId);
                        },
                        'create': async () => {
                            // const createdUser = await this.service.create(payload.body.userData, payload.body.role);
                        },
                        'update': async () => {
                            // const updatedUser = await this.service.update(payload.body.userId, payload.body.userData);
                        },
                        'delete': async () => {
                            // await this.service.delete(payload.body.userId);
                        }
                    }[payload.action])();
                }
            }[topic])();
        });
    }

    public register(userInformationData: any): void {}
}