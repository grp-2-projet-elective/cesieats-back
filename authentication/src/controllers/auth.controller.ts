import { EsbService } from '@grp-2-projet-elective/mqtt-helper';
import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { mqttClientOptions } from 'models/esb.models';
import { connect, MqttClient } from 'mqtt';
import { AuthService } from 'services/auth.service';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const AuthController = Router();

/**
 * Instance de notre service
 */
const mqttClient: MqttClient = connect('mqtt://localhost:1883', mqttClientOptions);
const esbService: EsbService = new EsbService(mqttClient, []);
const authService = new AuthService(esbService);

/**
 * Enregistrer un nouvel user
 */
AuthController.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const userInformationData = {
            ...req.body,
            password: hashedPassword
        }

        // users.push({ user: user, password: hashedPassword })
        // res.status(201).send(users)
        // console.log(users)

        const createdUser = await authService.register(userInformationData);

        return res
            .status(201)
            .json(createdUser);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
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
            .json(authService.login(req.body.username, req.body.username, req.body.password));

        // return res.status(401).send('Unauthorized');
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

AuthController.post("/refreshToken", async (req, res) => {
    try {
        const tokens = await authService.refreshToken(req.body.mail, req.body.refreshToken);

        return res.status(200).send(tokens);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});


AuthController.delete("/logout", async (req, res) => {
    try {
        await authService.logout(req.body.id);

        return res.status(204).send("Successfuly logged out");
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { AuthController };

