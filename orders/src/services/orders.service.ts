import axios from 'axios';
import { environment } from 'environment/environment';
import { IOrder, Order } from 'models/orders.model';
import { Roles } from 'models/users.model';
import { Exception, NotFoundException } from 'utils/exceptions';

export class OrdersService {
    private static instance: OrdersService;

    constructor() {
        OrdersService.instance = this;
    }

    /**
     * Trouve tous les orders
     */
    async findAll(): Promise<Array<IOrder>> {
        try {
            const orders = await Order.find();

            return orders;
        } catch (e) {
            throw new NotFoundException('No orders found');
        }
    }

    /**
     * Trouve un order en particulier
     * @param id - ID unique de l'order
     */
    async findOne(id: string): Promise<IOrder | null | undefined> {
        try {
            const order = await Order.findById(id);

            return order;
        } catch (e) {
            throw new NotFoundException('No order found');
        }
    }

    /**
     * Met à jour un order en particulier
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param orderData - Un objet correspondant à un order, il ne contient pas forcément tout un order. Attention, on ne prend pas l'id avec.
     * @param id - ID unique de l'order
     */
    async update(id: string, orderData: Partial<IOrder>): Promise<IOrder | null | undefined> {
        const order = await this.findOne(id);

        if (!order) {
            throw new NotFoundException('No order found');
        }

        const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true });

        return updatedOrder;
    }

    /**
     * Créé un order
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param orderData - Un objet correspondant à un order. Attention, on ne prend pas l'id avec.
     */
    async create(orderData: IOrder): Promise<IOrder> {
        const newOrder: IOrder = await Order.create(orderData);

        return newOrder;
    }

    /**
     * Suppression d'un order
     */
    async delete(id: string) {
        const order = await this.findOne(id);

        if (!order) {
            throw new NotFoundException('No order found');
        }

        await Order.findByIdAndRemove(id);
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
