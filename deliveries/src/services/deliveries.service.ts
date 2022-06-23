import axios from 'axios';
import { environment } from 'environment/environment';
import { Delivery, IDelivery } from 'models/deliveries.model';
import { Roles } from 'models/users.model';
import { Exception, NotFoundException } from 'utils/exceptions';

export class DeliveriesService {
    private static instance: DeliveriesService;

    constructor() {
        DeliveriesService.instance = this;
    }

    /**
     * Trouve tous les deliveries
     */
    async findAll(): Promise<Array<IDelivery>> {
        try {
            const deliveries = await Delivery.find();

            return deliveries;
        } catch (e) {
            throw new NotFoundException('No deliveries found');
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
        } catch (e) {
            throw new NotFoundException('No delivery found');
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
        const delivery = await this.findOne(id);

        if (!delivery) {
            throw new NotFoundException('No delivery found');
        }

        const updatedDelivery = await Delivery.findByIdAndUpdate(id, deliveryData, { new: true });

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
