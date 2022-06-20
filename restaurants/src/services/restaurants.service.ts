import { Restaurant, IRestaurant } from 'models/restaurants.model';
import { NotFoundException } from 'utils/exceptions';

export class RestaurantsService {
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
}
