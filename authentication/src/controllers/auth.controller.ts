import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { mqttClientOptions } from 'models/esb.model';
import { connect, MqttClient } from 'mqtt';
import { AuthService } from 'services/auth.service';
import { EsbService } from 'services/esb.service';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const AuthController = Router();

/**
 * Instance de notre service
 */
const mqttClient: MqttClient = connect('mqtt://localhost:1883', mqttClientOptions);
const esbService: EsbService = new EsbService(mqttClient, ['users']);
const authService = new AuthService(mqttClient, esbService);

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

        const createdUser = await authService.register({ mail: mail, password: hashedPassword });

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
        // const user = await service.findOne(req.body.userId);

        //if user does not exist, send a 400 response
        return res
            .status(201)
            .json(authService.login(req.body.username, req.body.password));

        return res.status(401).send('Unauthorized');
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

AuthController.post("/refreshToken", async (req, res) => {
    try {
        const tokens = await authService.refreshToken(req.body.userId, req.body.mail, req.body.refreshToken);

        return res.status(200).send(tokens);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});


AuthController.delete("/logout", async (req, res) => {
    try {
        await authService.logout(req.body.id);

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
export { AuthController };

