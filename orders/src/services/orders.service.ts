import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { IOrder, Order } from 'models/orders.model';

export class OrdersService {
    private readonly Logger: LoggerService = LoggerService.Instance('Orders API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/orders');

    constructor() { }

    /**
     * Trouve tous les orders
     */
    async findAll(): Promise<Array<IOrder>> {
        const orders = await Order.find();

        return orders;
    }

    /**
     * Trouve un order en particulier
     * @param id - ID unique de l'order
     */
    async findOne(id: string): Promise<IOrder | null | undefined> {
        const order = await Order.findById(id);

        return order;
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

        this.Logger.info('Order updated');
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

        this.Logger.info('Order created');
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
        this.Logger.info('Order deleted');
    }
}
