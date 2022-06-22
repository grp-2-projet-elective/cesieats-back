import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { AuthMiddleware } from 'middlewares/auth.middleware';
import { AuthService } from 'services/auth.service';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const AuthController = Router();

/**
 * Instance de notre service
 */
// const mqttClient: MqttClient = connect('mqtt://localhost:1883', mqttClientOptions);
// const esbService: EsbService = new EsbService(mqttClient, 'auth', []);
const authService = new AuthService();

/**
 * Enregistrer un nouvel user
 */
AuthController.post('/register', AuthMiddleware.verifyUserDucplication, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const userInformationData: any = {
            ...req.body,
            password: hashedPassword
        }

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
        const loginInformations = await authService.login(req.body.mail, req.body.password);
        if((loginInformations as any).status === 404) return res.status((loginInformations as any).status).json(loginInformations);
        return res.status(201).json(loginInformations);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

AuthController.post("/refreshToken", AuthMiddleware.verifyAccessToken, async (req, res) => {
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


AuthController.post("/logout", async (req, res) => {
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

