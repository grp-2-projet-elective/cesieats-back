import axios from 'axios';
import { environment } from 'environment/environment';
import { Product, IProduct } from 'models/products.model';
import { NotFoundException, Exception, Roles } from '@grp-2-projet-elective/cesieats-helpers';

export class ProductsService {
    private static instance: ProductsService;

    constructor() {
        ProductsService.instance = this;
    }

    /**
     * Trouve tous les products
     */
    async findAll(): Promise<Array<IProduct>> {
        try {
            const products = await Product.find();

            return products;
        } catch (e) {
            throw new NotFoundException('No products found');
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
        } catch (e) {
            throw new NotFoundException('No product found');
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

    public async asRole(mail: string, role: Roles): Promise<boolean> {
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/asRole/${mail}/${role}`;

            const asRole = ((await axios.get(apiUrl))).data as boolean;
            return asRole;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public static async asRole(mail: string, role: Roles): Promise<boolean> {
        try {
            const user = await this.instance.asRole(mail, role);
            if (user === null) return false;
            return true;
        } catch (e: any) {
            throw new Exception(e, e.status ? e.status : 500);
        }
    }
}
