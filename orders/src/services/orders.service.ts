import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { IOrder, Order, OrdersStats } from 'models/orders.model';

export class OrdersService {
    private readonly Logger: LoggerService = LoggerService.Instance('Orders API', environment.logDir);

    constructor() { }

    /**
     * Trouve toutes les commandes
     */
    async findAll(): Promise<Array<IOrder>> {
        try {
            const orders = await Order.find();

            return orders;
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
    async findOne(id: string): Promise<IOrder | null | undefined> {
        try {
            const order = await Order.findById(id);

            return order;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param id 
     * @param orderData 
     * @returns 
     */
    async update(id: string, orderData: Partial<IOrder>): Promise<IOrder | null | undefined> {
        try {
            const order = await this.findOne(id);

            if (!order) {
                throw new NotFoundException('No order found');
            }

            const updatedOrder = await Order.findByIdAndUpdate(id, orderData, { new: true });

            this.Logger.info('Order updated');
            return updatedOrder;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param orderData 
     * @returns 
     */
    async create(orderData: IOrder): Promise<IOrder> {
        try {
            const newOrder: IOrder = await Order.create(orderData);

            this.Logger.info('Order created');
            return newOrder;
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
            const order = await this.findOne(id);

            if (!order) {
                throw new NotFoundException('No order found');
            }

            await Order.findByIdAndRemove(id);
            this.Logger.info('Order deleted');
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @returns 
     */
    public async getStats(): Promise<OrdersStats | void> {
        try {
            const ordersCount = await Order.count();

            return {
                ordersCount
            }
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }
}
