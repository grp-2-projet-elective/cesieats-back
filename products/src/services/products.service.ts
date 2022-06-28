import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { IProduct, Product, ProductsStats } from 'models/products.model';

export class ProductsService {

    private readonly Logger: LoggerService = LoggerService.Instance('Products API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/products');

    constructor() { }

    /**
     * Trouve tous les products
     */
    async findAll(): Promise<Array<IProduct>> {
        try {
            const products = await Product.find();

            return products;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Trouve un product en particulier
     * @param id - ID unique de l'product
     */
    async findOne(id: string): Promise<IProduct | null | undefined> {
        try {
            const product = await Product.findById(id);

            return product;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
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
        try {
            const product = await this.findOne(id);

            if (!product) {
                throw new NotFoundException('No product found');
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });

            this.Logger.info('Product updated');
            return updatedProduct;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Créé un product
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param productData - Un objet correspondant à un product. Attention, on ne prend pas l'id avec.
     */
    async create(productData: IProduct): Promise<IProduct> {
        try {
            const newProduct: IProduct = await Product.create(productData);

            this.Logger.info('Product created');
            return newProduct;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Suppression d'un product
     */
    async delete(id: string) {
        try {
            const product = await this.findOne(id);

            if (!product) {
                throw new NotFoundException('No product found');
            }

            await Product.findByIdAndRemove(id);
            this.Logger.info('Product deleted');
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }
    
    public async getStats(): Promise<ProductsStats | void> {
        try {
            const productsCount = await Product.count();

            return {
                productsCount
            }
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }
}
