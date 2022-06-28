import { LoggerService } from '@grp-2-projet-elective/cesieats-helpers';
import * as bcrypt from 'bcrypt';
import { environment } from 'environment/environment';
import { Router } from 'express';
import { AuthService } from 'services/auth.service';

const Logger: LoggerService = LoggerService.Instance('Auth API', environment.logDir);

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
AuthController.post('/register', async (req, res, next) => {
    Logger.info('Requesting account registration');
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
    } catch (error: any) {
        Logger.error(error);
        res.status(error.status).json(error);
    }
});


/**
 * Connecter un user
 */
AuthController.post('/login', async (req, res, next) => {
    Logger.info('Requesting account login');
    try {
        const loginInformations = await authService.login(req.body.mail, req.body.password);
        return res.status(201).json(loginInformations);
    } catch (error: any) {
        Logger.error(error);
        res.status(error.status).json(error);
    }
});

AuthController.post("/refreshToken", async (req, res, next) => {
    Logger.info('Requesting account token refresh');
    try {
        const tokens = await authService.refreshToken(req.body.mail, req.body.refreshToken);

        return res.status(200).send(tokens);
    } catch (error: any) {
        Logger.error(error);
        res.status(error.status).json(error);
    }
});


AuthController.post("/logout", async (req, res, next) => {
    Logger.info('Requesting account logout');
    try {
        const logoutResponse = await authService.logout(req.body.id);

        return res.status(logoutResponse.status).send(logoutResponse.message);
    } catch (error: any) {
        Logger.error(error);
        res.status(error.status).json(error);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { AuthController };

