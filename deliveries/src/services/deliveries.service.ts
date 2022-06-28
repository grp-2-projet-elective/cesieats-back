import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { DeliveriesStats, Delivery, IDelivery } from 'models/deliveries.model';

export class DeliveriesService {

    private readonly Logger: LoggerService = LoggerService.Instance('Deliveries API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/deliveries');

    constructor() { }

    /**
     * Trouve tous les deliveries
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
     * Trouve un delivery en particulier
     * @param id - ID unique de l'delivery
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

    /**
     * Met à jour un delivery en particulier
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param deliveryData - Un objet correspondant à un delivery, il ne contient pas forcément tout un delivery. Attention, on ne prend pas l'id avec.
     * @param id - ID unique de l'delivery
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
     * Créé un delivery
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param deliveryData - Un objet correspondant à un delivery. Attention, on ne prend pas l'id avec.
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
     * Suppression d'un delivery
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
