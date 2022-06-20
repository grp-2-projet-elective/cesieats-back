import { EsbService, initMqttClient } from '@grp-2-projet-elective/mqtt-helper';
import { Router } from 'express';
import { mqttClientOptions } from 'models/esb.models';
import { MqttClient } from 'mqtt';
import { UsersService } from 'services/users.service';
import { BadRequestException } from 'utils/exceptions';

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const UsersController = Router();

/**
 * Instance de notre usersService
 */
const mqttClient: MqttClient = initMqttClient('mqtt://localhost:1883', mqttClientOptions);
const esbService: EsbService = new EsbService(mqttClient, ['users']);
const usersService = new UsersService(esbService);

/**
 * Trouve tous les users
 */
UsersController.get('/', async (req, res) => {
    try {
        return res
            .status(200)
            .json(await usersService.findAll());
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * Trouve un user en particulier
 */
UsersController.get('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const user = await usersService.findOne(id);

        return res
            .status(200)
            .json(user);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * Créé un user
 */
UsersController.post('/', async (req, res) => {
    try {
        const createdUser = await usersService.create(req.body.userData, req.body.role);

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
 * Mise à jour d'un user
 */
UsersController.patch('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedUser = await usersService.update(id, req.body.userData);

        return res
            .status(200)
            .json(updatedUser);
    } catch (e: any) {
        console.error(e);
        return res
            .status(e.status ? e.status : 500)
            .json(e);
    }
});

/**
 * Suppression d'un user
 */
UsersController.delete('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const response = await usersService.delete(id);

        return res
            .status(200)
            .json(response);
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
export { UsersController, usersService };

