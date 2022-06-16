import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { IUserInformation } from 'models/auth.models';
import { AuthService } from 'services/auth.service';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const AuthController = Router();

/**
 * Instance de notre service
 */
const service = new AuthService();

/**
 * Créé un user
 */
AuthController.post('/', async (req, res) => {
    try {
        const username = req.body.username;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // users.push({ user: user, password: hashedPassword })
        // res.status(201).send(users)
        // console.log(users)

        const createdUser = await service.create({ username: username, password: hashedPassword });

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
        const user: IUserInformation = await service.findOne(req.body.userId) as IUserInformation;

        //if user does not exist, send a 400 response
        if (await bcrypt.compare(req.body.password, user.password)) {
            const accessToken = service.generateAccessToken(req.body.username);
            const refreshToken = service.generateRefreshToken(req.body.username);
            return res
                .status(201)
                .json({ accessToken: accessToken, refreshToken: refreshToken });
        }

        return res.status(401).send('Unauthorized');
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

AuthController.post("/refreshToken", async (req, res) => {
    if (!refreshTokens.includes(req.body.token)) res.status(400).send("Refresh Token Invalid");
    // refreshTokens = refreshTokens.filter((c) => c != req.body.token);
    const refreshToken = await service.findOne(req.body.tokenId);


    //remove the old refreshToken from the refreshTokens list
    const accessToken = service.generateAccessToken(req.body.username);
    const refreshToken = service.generateRefreshToken(req.body.username);
    //generate new accessToken and refreshTokens
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});


AuthController.delete("/logout", async (req, res) => {
    const refreshToken = await service.delete(req.body.token);
    //remove the old refreshToken from the refreshTokens list
    res.status(204).send("Logged out!");
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { AuthController };

