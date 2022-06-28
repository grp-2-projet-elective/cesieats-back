import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { IRestaurant, Restaurant } from 'models/restaurants.model';

export class RestaurantsService {

    private readonly Logger: LoggerService = LoggerService.Instance('Restaurants API', 'C:/Users/felic/Documents/CESI/Elective/Projet/dev/logs/restaurants');

    private static instance: RestaurantsService;

    constructor() {
        RestaurantsService.instance = this;
    }

    /**
     * Trouve tous les restaurants
     */
    async findAll(): Promise<Array<IRestaurant>> {
        const restaurants = await Restaurant.find();

        return restaurants;
    }

    /**
     * Trouve un restaurant en particulier
     * @param id - ID unique de l'restaurant
     */
    async findOne(id: string): Promise<IRestaurant | null | undefined> {
        const restaurant = await Restaurant.findById(id);

        return restaurant;
    }

    async findOneByName(restaurantName: string): Promise<IRestaurant | null | undefined> {
        const restaurant = await Restaurant.findOne({ where: { name: restaurantName } });

        return restaurant;
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
        this.Logger.info('Restaurant updated');

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

        this.Logger.info('Restaurant created');
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
        this.Logger.info('Restaurant deleted');
    }

    public static async isRestaurantDuplicated(restaurantName: string): Promise<boolean> {
        const user = await this.instance.findOneByName(restaurantName);
        if (user === null) return false;
        return true;
    }
}
