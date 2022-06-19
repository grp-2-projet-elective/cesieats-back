import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { MqttClient } from 'mqtt';
import { AuthService } from 'services/auth.service';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const AuthController = Router();

/**
 * Instance de notre service
 */
const service = new AuthService();

async function initMqttAuthListening(mqttClient: MqttClient): Promise<void> {
    service.mqttClient = mqttClient;

    mqttClient.on('message', function (topic, message) {
        // message is Buffer
        console.log(topic);
        console.log(message.toString());

        ({
            'authentication': async (message: string) => {
                const payload = JSON.parse(message);

                ({
                    'register': async (message: string) => {
                        const payload = JSON.parse(message);
                    },
                    'login': async (message: string) => {
                        const payload = JSON.parse(message);
                    },
                    'logout': async (message: string) => {
                        const payload = JSON.parse(message);
                    }
                }[payload.action])();
            }
        }[topic])();
    });
}


/**
 * Enregistrer un nouvel user
 */
AuthController.post('/register', async (req, res) => {
    try {
        const mail = req.body.mail;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // users.push({ user: user, password: hashedPassword })
        // res.status(201).send(users)
        // console.log(users)

        const createdUser = await service.register({ mail: mail, password: hashedPassword });

        return res
            .status(201)
            .json(createdUser);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});


/**
 * Connecter un user
 */
AuthController.post('/login', async (req, res) => {
    try {
        const user = await service.findOne(req.body.userId);

        //if user does not exist, send a 400 response
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = service.generateAccessToken(req.body.username);
            const refreshToken = service.generateRefreshToken(req.body.username);
            return res
                .status(201)
                .json(service.login());
        }

        return res.status(401).send('Unauthorized');
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

AuthController.post("/refreshToken", async (req, res) => {
    try {
        const tokens = await service.refreshToken(req.body.userId, req.body.mail, req.body.refreshToken);

        return res.status(200).send(tokens);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});


AuthController.delete("/logout", async (req, res) => {
    try {
        await service.logout(req.body.id);

        return res.status(204).send("Successfuly logged out");
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { AuthController, initMqttAuthListening };

