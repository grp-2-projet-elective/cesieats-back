
import { IErrorCallback, IPayload } from "models/esb.model";
import { MqttClient } from "mqtt";
import { Subject } from "rxjs";
import { UsersService } from "./users.service";

export class EsbService {
    public readonly isMqttClientConnected: boolean = false;
    public readonly responseSubject: Subject<IPayload> = new Subject<IPayload>();

    constructor(private readonly mqttClient: MqttClient, public readonly topics: Array<string>, public readonly service: UsersService) { }

    public initEsbService() {
        this.mqttClient.on('connect', () => {
            this.mqttClient.connected = true;

            this.mqttClient.subscribe('users', (err: Error) => {
                if (!err) {
                    this.initEsbMessagesListening();
                    console.log('ESB topics subscribed');
                    return;
                }

                console.error(err);
            });
        });

        this.mqttClient.on("error", (err: IErrorCallback) => {
            console.error("Error: " + err);

            if (err.code == "ENOTFOUND") {
                console.error("Network error, make sure you have an active internet connection");
            }
        });

        this.mqttClient.on("close", () => {
            console.log("Connection closed by client");
        });

        this.mqttClient.on("reconnect", () => {
            console.log("Client trying a reconnection");
        });

        this.mqttClient.on("offline", () => {
            console.log("Client is currently offline");
        });
    }

    private initEsbMessagesListening(): void {
        this.mqttClient.on('message', async (topic: string, message: string) => {
            // message is Buffer
            console.log(topic);
            console.log(message.toString());

            await ({
                'users': async (message: string) => {
                    const payload: IPayload = JSON.parse(message);

                    ({
                        'findAll': async () => {
                            const users = await this.service.findAll();

                            const responsePayload = {
                                id: payload.id,
                                action: 'findAll',
                                users: users
                            };

                            this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
                        },
                        'findOne': async () => {
                            const user = await this.service.findOne(payload.body.userId);

                            const responsePayload = {
                                id: payload.id,
                                action: 'findOne',
                                user: user
                            };

                            this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
                        },
                        'create': async () => {
                            const createdUser = await this.service.create(payload.body.userData, payload.body.role);

                            const responsePayload = {
                                id: payload.id,
                                action: 'create',
                                createdUser: createdUser
                            };

                            this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
                        },
                        'update': async () => {
                            const updatedUser = await this.service.update(payload.body.userId, payload.body.userData);

                            const responsePayload = {
                                id: payload.id,
                                action: 'update',
                                updatedUser: updatedUser
                            };

                            this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
                        },
                        'delete': async () => {
                            await this.service.delete(payload.body.userId);

                            const responsePayload = {
                                id: payload.id,
                                action: 'delete'
                            };

                            this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
                        }
                    }[payload.action])();
                }
            }[topic])();
        });
    }
}