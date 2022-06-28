import { NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { IProduct, Product } from 'models/products.model';

export class ProductsService {

    constructor() { }

    /**
     * Trouve tous les products
     */
    async findAll(): Promise<Array<IProduct>> {
        const products = await Product.find();

        return products;
    }

    /**
     * Trouve un product en particulier
     * @param id - ID unique de l'product
     */
    async findOne(id: string): Promise<IProduct | null | undefined> {
        const product = await Product.findById(id);

        return product;
    }

    /**
     * Met à jour un product en particulier
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param productData - Un objet correspondant à un product, il ne contient pas forcément tout un product. Attention, on ne prend pas l'id avec.
     * @param id - ID unique de l'product
     */
    async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null | undefined> {
        const product = await this.findOne(id);

        if (!product) {
            throw new NotFoundException('No product found');
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });

        return updatedProduct;
    }

    /**
     * Créé un product
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param productData - Un objet correspondant à un product. Attention, on ne prend pas l'id avec.
     */
    async create(productData: IProduct): Promise<IProduct> {
        const newProduct: IProduct = await Product.create(productData);

        return newProduct;
    }

    /**
     * Suppression d'un product
     */
    async delete(id: string) {
        const product = await this.findOne(id);

        if (!product) {
            throw new NotFoundException('No product found');
        }

        await Product.findByIdAndRemove(id);
    }
}
