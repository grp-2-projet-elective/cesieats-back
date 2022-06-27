import { Exception, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import axios from 'axios';
import { environment } from 'environment/environment';
import * as jwt from 'jsonwebtoken';
import { IRestaurant, Restaurant } from 'models/restaurants.model';

export class RestaurantsService {
    private static instance: RestaurantsService;

    constructor() {
        RestaurantsService.instance = this;
    }

    /**
     * Trouve tous les restaurants
     */
    async findAll(): Promise<Array<IRestaurant>> {
        try {
            const restaurants = await Restaurant.find();

            return restaurants;
        } catch (e) {
            throw new NotFoundException('No restaurants found');
        }
    }

    /**
     * Trouve un restaurant en particulier
     * @param id - ID unique de l'restaurant
     */
    async findOne(id: string): Promise<IRestaurant | null | undefined> {
        try {
            const restaurant = await Restaurant.findById(id);

            return restaurant;
        } catch (e) {
            throw new NotFoundException('No restaurant found');
        }
    }

    async findOneByName(restaurantName: string): Promise<IRestaurant | null | undefined> {
        try {
            const restaurant = await Restaurant.findOne({ where: { name: restaurantName } });

            return restaurant;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    /**
     * Met à jour un restaurant en particulier
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param restaurantData - Un objet correspondant à un restaurant, il ne contient pas forcément tout un restaurant. Attention, on ne prend pas l'id avec.
     * @param id - ID unique de l'restaurant
     */
    async update(id: string, restaurantData: Partial<IRestaurant>): Promise<IRestaurant | null | undefined> {
        const restaurant = await this.findOne(id);

        if (!restaurant) {
            throw new NotFoundException('No restaurant found');
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, restaurantData, { new: true });

        return updatedRestaurant;
    }

    /**
     * Créé un restaurant
     *
     * /!\ Idéalement, il faudrait vérifier le contenu de la requête avant de le sauvegarder.
     *
     * @param restaurantData - Un objet correspondant à un restaurant. Attention, on ne prend pas l'id avec.
     */
    async create(restaurantData: IRestaurant): Promise<IRestaurant> {
        const newRestaurant: IRestaurant = await Restaurant.create(restaurantData);

        return newRestaurant;
    }

    /**
     * Suppression d'un restaurant
     */
    async delete(id: string) {
        const restaurant = await this.findOne(id);

        if (!restaurant) {
            throw new NotFoundException('No restaurant found');
        }

        await Restaurant.findByIdAndRemove(id);
    }

    public async getUserByMail(mail: string): Promise<any> {
        try {
            const apiUrl: string = `http://${environment.USERS_API_HOSTNAME}:${environment.USERS_API_PORT}/api/v1/users/${mail}`;

            const user = (await axios.get(apiUrl)).data;
            return user;
        } catch (e: any) {
            throw new Exception(e.error, e.status);
        }
    }

    public static async isRestaurantDuplicated(restaurantName: string): Promise<boolean> {
        try {
            const user = await this.instance.findOneByName(restaurantName);
            if (user === null) return false;
            return true;
        } catch (e: any) {
            throw new Exception(e, e.status ? e.status : 500);
        }
    }
}
