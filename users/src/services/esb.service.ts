// import { IErrorCallback, ResponseEvent } from '@grp-2-projet-elective/mqtt-helper/dist';
// import EventEmitter from 'events';
// import { MqttClient } from 'mqtt';

// export class EsbService {
//     public readonly isMqttClientConnected: boolean = false;
//     public readonly eventEmitter: EventEmitter = new EventEmitter();

//     constructor(private readonly mqttClient: MqttClient, public readonly topics: Array<string>) { }

//     public initEsbService() {
//         this.mqttClient.on('connect', () => {
//             this.mqttClient.connected = true;
//             console.log(`Connected to mqtt ${new Date()}`);

//             this.mqttClient.subscribe(['response/+/+'], (err: Error) => {
//                 if (!err) {
//                     this.initEsbMessagesListening();
//                     console.log('ESB topics subscribed');
//                     return;
//                 }

//                 console.error(err);
//             });
//         });

//         this.mqttClient.on('error', (err: IErrorCallback) => {
//             console.error('Error: ' + err);

//             if (err.code == 'ENOTFOUND') {
//                 console.error('Network error, make sure you have an active internet connection');
//             }
//         });

//         this.mqttClient.on('close', () => {
//             console.log('Connection closed by client');
//         });

//         this.mqttClient.on('reconnect', () => {
//             console.log('Client trying a reconnection');
//         });

//         this.mqttClient.on('offline', () => {
//             console.log('Client is currently offline');
//         });
//     }

//     private initEsbMessagesListening(): void {
//         this.mqttClient.on('message', (topic, payload) => {
//             const topicArr = topic.split('/'); //spliting the topic ==> [response,deviceName,relayName]
//             switch (topicArr[0]) {
//                 case 'response':
//                     return ResponseEvent(this.eventEmitter, topicArr[1], topicArr[2], payload);
//                 case 'otherTopics':
//                     console.log('other topics');
//                     return;
//                 default:
//                     return console.log('can not find anything');
//             }
//         });

//         this.mqttClient.on("message", (topic, payload, packet) => {
//             console.log(packet);
//             const { relayState } = JSON.parse(payload.toString());
//             console.log(payload.toString());
//             if (
//                 packet.properties &&
//                 packet.properties.responseTopic &&
//                 packet.properties.correlationData &&
//                 packet.properties.correlationData.toString() === process.env.ESB_SECRET
//             ) {
//                 const responseData = {
//                     error: false,
//                     message: `${relayState === 1 ? "relay opened" : "relay closed"}`,
//                 };
//                 this.mqttClient.publish(
//                     packet.properties.responseTopic,
//                     JSON.stringify(responseData)
//                 );
//             }
//         });

//         // this.mqttClient.on('message', async (topic: string, message: string) => {
//         //     // message is Buffer
//         //     console.log(topic);
//         //     console.log(message.toString());

//         //     await ({
//         //         'users': async (message: string) => {
//         //             const payload: IPayload = JSON.parse(message);

//         //             ({
//         //                 'findAll': async () => {
//         //                     const users = await this.service.findAll();

//         //                     const responsePayload = {
//         //                         id: payload.id,
//         //                         action: 'findAll',
//         //                         users: users
//         //                     };

//         //                     this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
//         //                 },
//         //                 'findOne': async () => {
//         //                     const user = await this.service.findOne(payload.body.userId);

//         //                     const responsePayload = {
//         //                         id: payload.id,
//         //                         action: 'findOne',
//         //                         user: user
//         //                     };

//         //                     this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
//         //                 },
//         //                 'create': async () => {
//         //                     const createdUser = await this.service.create(payload.body.userData, payload.body.role);

//         //                     const responsePayload = {
//         //                         id: payload.id,
//         //                         action: 'create',
//         //                         createdUser: createdUser
//         //                     };

//         //                     this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
//         //                 },
//         //                 'update': async () => {
//         //                     const updatedUser = await this.service.update(payload.body.userId, payload.body.userData);

//         //                     const responsePayload = {
//         //                         id: payload.id,
//         //                         action: 'update',
//         //                         updatedUser: updatedUser
//         //                     };

//         //                     this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
//         //                 },
//         //                 'delete': async () => {
//         //                     await this.service.delete(payload.body.userId);

//         //                     const responsePayload = {
//         //                         id: payload.id,
//         //                         action: 'delete'
//         //                     };

//         //                     this.mqttClient.publish('users-response', JSON.stringify(responsePayload));
//         //                 }
//         //             }[payload.action])();
//         //         }
//         //     }[topic])();
//         // });
//     }

//     // private async startResponsePattern(
//     //     apiName: string,
//     //     action: string,
//     //     payload: string,
//     // ) {
//     //     try {
//     //         const responseTopic = `response/${apiName}/${action}`;
//     //         const requestTopic = `request/${apiName}/${action}`;
//     //         const responseEventName = `responseEvent/${apiName}/${action}`;
//     //         const publishOptions: IClientPublishOptions = {
//     //             qos: 1,
//     //             properties: {
//     //                 responseTopic,
//     //                 correlationData: Buffer.from('secret', 'utf-8'),
//     //             },
//     //         };
//     //         const responseMessage = await publishWithResponse(this.mqttClient, payload, publishOptions, requestTopic, responseEventName, this.eventEmitter);
//     //         console.log(`${apiName}/${action} : ${responseMessage.payload}`);
//     //     } catch (error) {
//     //         console.error(`${apiName}/${action} : ${error}`);
//     //     }
//     // };
// }