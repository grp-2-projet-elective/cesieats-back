import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import axios from 'axios';
import { environment } from 'environment/environment';
import { DeliveriesStats, Delivery, IDelivery } from 'models/deliveries.model';

export class DeliveriesService {

    private readonly Logger: LoggerService = LoggerService.Instance('Deliveries API', environment.logDir);

    constructor() { }

    /**
     * Trouve toutes les livraisons
     */
    async findAll(): Promise<Array<IDelivery>> {
        try {
            const deliveries = await Delivery.find();

            return deliveries;
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
    async findOne(id: string): Promise<IDelivery | null | undefined> {
        try {
            const delivery = await Delivery.findById(id);

            return delivery;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    async findAvailableDeliveryMan(not?: number): Promise<Array<number> | null | undefined> {
        try {
            // const deliveries = await Delivery.find({ where: { deliveryState: 'En cours de livraison' } });
            const deliverByState = (await Delivery.aggregate(
                [
                    {
                        $group: {
                            _id: {
                                deliveryState: '$deliveryState',
                                deliveryManId: '$deliveryManId'
                            },
                        }
                    }
                ],
            )).map(delivery => delivery._id);

            const unavailableDeliveryMans = deliverByState.map(delivery => {
                if (delivery.deliveryState === 'En cours de livraison') {
                    return delivery.deliveryManId
                }
            }).filter(deliveryManId => deliveryManId !== undefined);
            if (not) unavailableDeliveryMans.push(not)

            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/availableDeliveryMan`;

            const deliveryMan = (await axios.post(apiUrl, { unavailableDeliveryMans: unavailableDeliveryMans })).data;
            return deliveryMan;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param id 
     * @param deliveryData 
     * @returns 
     */
    async update(id: string, deliveryData: Partial<IDelivery>): Promise<IDelivery | null | undefined> {
        try {
            const delivery = await this.findOne(id);

            if (!delivery) {
                throw new NotFoundException('No delivery found');
            }

            const updatedDelivery = await Delivery.findByIdAndUpdate(id, deliveryData, { new: true });

            this.Logger.info('Delivery updated');
            return updatedDelivery;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param deliveryData 
     * @returns 
     */
    async create(deliveryData: IDelivery): Promise<IDelivery> {
        try {
            const newDelivery: IDelivery = await Delivery.create(deliveryData);

            this.Logger.info('Delivery created');
            return newDelivery;
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
            const delivery = await this.findOne(id);

            if (!delivery) {
                throw new NotFoundException('No delivery found');
            }

            await Delivery.findByIdAndRemove(id);
            this.Logger.info('Delivery deleted');
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @returns 
     */
    public async getStats(): Promise<DeliveriesStats | void> {
        try {
            const deliveriesCount = await Delivery.count();

            return {
                deliveriesCount
            }
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }
}
