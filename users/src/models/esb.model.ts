import { IClientOptions } from "mqtt";

export const mqttClientOptions: IClientOptions = {
    port: 1883,
    protocolVersion: 5,
    keepalive: 60,
    properties: {
        requestResponseInformation: true,
        requestProblemInformation: true,
    },
};
