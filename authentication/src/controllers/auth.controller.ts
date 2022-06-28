import { LoggerService } from '@grp-2-projet-elective/cesieats-helpers';
import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { AuthService } from 'services/auth.service';

const Logger: LoggerService = LoggerService.Instance('Auth API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/auth');

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const AuthController = Router();

/**
 * Instance de notre service
 */
const authService = new AuthService();

/**
 * Enregistrer un nouvel user
 */
AuthController.post('/register', async (req, res) => {
    Logger.info('Requesting account registration');
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const userInformationData: any = {
        ...req.body,
        password: hashedPassword
    }

    const createdUser = await authService.register(userInformationData);

    return res
        .status(201)
        .json(createdUser);
});


/**
 * Connecter un user
 */
AuthController.post('/login', async (req, res) => {
    Logger.info('Requesting account login');
    const loginInformations = await authService.login(req.body.mail, req.body.password);
    return res.status(201).json(loginInformations);
});

AuthController.post("/refreshToken", async (req, res) => {
    Logger.info('Requesting account token refresh');
    const tokens = await authService.refreshToken(req.body.mail, req.body.refreshToken);

    return res.status(200).send(tokens);
});


AuthController.post("/logout", async (req, res) => {
    Logger.info('Requesting account logout');
    const logoutResponse = await authService.logout(req.body.id);

    return res.status(logoutResponse.status).send(logoutResponse.message);
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { AuthController };

