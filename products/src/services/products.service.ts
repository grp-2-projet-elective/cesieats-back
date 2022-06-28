import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { IProduct, Product, ProductsStats } from 'models/products.model';

export class ProductsService {

    private readonly Logger: LoggerService = LoggerService.Instance('Products API', environment.logDir);

    constructor() { }

    /**
     * Trouve tous les produits
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
     * 
     * @param id 
     * @returns 
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
     * 
     * @param id 
     * @param productData 
     * @returns 
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
     * 
     * @param productData 
     * @returns 
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
     * 
     * @param id 
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
    
    /**
     * 
     * @returns 
     */
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
