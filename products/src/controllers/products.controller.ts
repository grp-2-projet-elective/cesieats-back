import { BadRequestException, LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { Router } from 'express';
import { ProductsService } from 'services/products.service';

const Logger: LoggerService = LoggerService.Instance('Products API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/products');

/**
 * Nous créons un `Router` Express, il nous permet de créer des routes en dehors du fichier `src/index.ts`
 */
const ProductsController = Router();

/**
 * Instance de notre service
 */
const service = new ProductsService();

/**
 * Trouve tous les products
 */
ProductsController.get('/', async (req, res) => {
    Logger.info('Requesting all products');
    return res
        .status(200)
        .json(await service.findAll());
});

/**
 * Trouve un product en particulier
 */
ProductsController.get('/:id', async (req, res) => {
    Logger.info('Requesting single product');
    const id = req.params.id;

    if (!id) {
        throw new BadRequestException('Invalid id');
    }

    const product = await service.findOne(id);

    if (!product) {
        throw new NotFoundException('No product found');
    }

    return res
        .status(200)
        .json(product);
});

/**
 * Créé un product
 */
ProductsController.post('/', async (req, res) => {
    Logger.info('Requesting product creation');
    const createdProduct = await service.create(req.body);

    return res
        .status(201)
        .json(createdProduct);
});

/**
 * Mise à jour d'un product
 */
ProductsController.patch('/:id', async (req, res) => {
    Logger.info('Requesting product update');
    const id = req.params.id;

    if (!id) {
        throw new BadRequestException('Invalid id');
    }

    const updatedProduct = await service.update(id, req.body);

    return res
        .status(200)
        .json(updatedProduct);
});

/**
 * Suppression d'un product
 */
ProductsController.delete('/:id', async (req, res) => {
    Logger.info('Requesting product deletion');
    const id = req.params.id;

    if (!id) {
        throw new BadRequestException('Invalid id');
    }

    return res
        .status(200)
        .json(await service.delete(id));
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { ProductsController };

