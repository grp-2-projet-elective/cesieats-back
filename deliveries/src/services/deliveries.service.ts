import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { Delivery, IDelivery } from 'models/deliveries.model';

export class DeliveriesService {

    private readonly Logger: LoggerService = LoggerService.Instance('Deliveries API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/deliveries');

    constructor() { }

    /**
     * Trouve tous les deliveries
     */
    async findAll(): Promise<Array<IDelivery>> {
        const deliveries = await Delivery.find();

        return deliveries;
    }

    /**
     * Trouve un delivery en particulier
     * @param id - ID unique de l'delivery
     */
    async findOne(id: string): Promise<IDelivery | null | undefined> {
        const delivery = await Delivery.findById(id);

        return delivery;
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
        const delivery = await this.findOne(id);

        if (!delivery) {
            throw new NotFoundException('No delivery found');
        }

        const updatedDelivery = await Delivery.findByIdAndUpdate(id, deliveryData, { new: true });

        this.Logger.info('Delivery updated');
        return updatedDelivery;
    }

    /**
     * Créé un delivery
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param deliveryData - Un objet correspondant à un delivery. Attention, on ne prend pas l'id avec.
     */
    async create(deliveryData: IDelivery): Promise<IDelivery> {
        const newDelivery: IDelivery = await Delivery.create(deliveryData);

        this.Logger.info('Delivery created');
        return newDelivery;
    }

    /**
     * Suppression d'un delivery
     */
    async delete(id: string) {
        const delivery = await this.findOne(id);

        if (!delivery) {
            throw new NotFoundException('No delivery found');
        }

        await Delivery.findByIdAndRemove(id);
        this.Logger.info('Delivery deleted');
    }
}
