import { Router } from 'express';
import { ProductsService } from 'services/products.service';
import { BadRequestException, NotFoundException } from 'utils/exceptions';

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
    try {
        return res
            .status(200)
            .json(await service.findAll());
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Trouve un product en particulier
 */
ProductsController.get('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

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
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Créé un product
 */
ProductsController.post('/', async (req, res) => {
    try {
        const createdProduct = await service.create(req.body);

        return res
            .status(201)
            .json(createdProduct);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Mise à jour d'un product
 */
ProductsController.patch('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        const updatedProduct = await service.update(id, req.body);

        return res
            .status(200)
            .json(updatedProduct);
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * Suppression d'un product
 */
ProductsController.delete('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);

        if (!id) {
            throw new BadRequestException('Invalid id');
        }

        return res
            .status(200)
            .json(await service.delete(id));
    } catch (e: any) {
        return res
            .status(e.status)
            .json(e.message);
    }
});

/**
 * On expose notre controller pour l'utiliser dans `src/index.ts`
 */
export { ProductsController };

