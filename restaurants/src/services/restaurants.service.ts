import { LoggerService, NotFoundException } from '@grp-2-projet-elective/cesieats-helpers';
import { environment } from 'environment/environment';
import { IRestaurant, Restaurant, RestaurantsStats } from 'models/restaurants.model';

export class RestaurantsService {

    private readonly Logger: LoggerService = LoggerService.Instance('Restaurants API', environment.logDir);

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
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * Trouve un restaurant en particulier
     * @param id - ID unique du restaurant
     */
    async findOne(id: string): Promise<IRestaurant | null | undefined> {
        try {
            const restaurant = await Restaurant.findById(id);

            return restaurant;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
    * Trouve un restaurant en particulier
    * @param id - ID unique du restaurant
    */
    async findOneByOwner(restaurantOwnerId: number): Promise<IRestaurant | null | undefined> {
        try {
            const restaurant = await Restaurant.findOne({ restaurantOwnerId });

            return restaurant;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param restaurantName 
     * @returns 
     */
    async findOneByName(name: string): Promise<IRestaurant | null | undefined> {
        try {
            const restaurant = await Restaurant.findOne({ name });

            return restaurant;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param id 
     * @param restaurantData 
     * @returns 
     */
    async update(id: string, restaurantData: Partial<IRestaurant>): Promise<IRestaurant | null | undefined> {
        try {
            const restaurant = await this.findOne(id);

            if (!restaurant) {
                throw new NotFoundException('No restaurant found');
            }

            const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, restaurantData, { new: true });
            this.Logger.info('Restaurant updated');

            return updatedRestaurant;
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param restaurantData 
     * @returns 
     */
    async create(restaurantData: IRestaurant): Promise<IRestaurant> {
        try {
            const newRestaurant: IRestaurant = await Restaurant.create(restaurantData);

            this.Logger.info('Restaurant created');
            return newRestaurant;
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
            const restaurant = await this.findOne(id);

            if (!restaurant) {
                throw new NotFoundException('No restaurant found');
            }

            await Restaurant.findByIdAndRemove(id);
            this.Logger.info('Restaurant deleted');
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @returns 
     */
    public async getStats(): Promise<RestaurantsStats | void> {
        try {
            const restaurantsCount = await Restaurant.count();

            return {
                restaurantsCount
            }
        } catch (error) {
            this.Logger.error(error);
            throw error;
        }
    }

    /**
     * 
     * @param restaurantName 
     * @returns 
     */
    public static async isRestaurantDuplicated(restaurantName: string): Promise<boolean> {
        try {
            const user = await this.instance.findOneByName(restaurantName);
            if (user === null) return false;
            return true;
        } catch (error) {
            RestaurantsService.instance.Logger.error(error);
            throw error;
        }
    }
}
