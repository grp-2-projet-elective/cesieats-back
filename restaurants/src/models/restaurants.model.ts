import { Document, model, Model, Schema } from 'mongoose';

export interface IRestaurant extends Document {
    name: string,
    description?: string,
    image: string,
    categories?: Array<string>,
    restaurantOwnerId: number,
    openingHours: string,
    location: {
        city: string,
        zipCode: string,
        address: string,
        latitude: number,
        longitude: number,
    },
}

export const RestaurantSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    image: { type: String, required: true },
    categories: { type: Array, required: true },
    restaurantOwnerId: { type: Number, required: true },
    openingHours: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        address: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
});

export const Restaurant: Model<IRestaurant> = model('Restaurant', RestaurantSchema) as Model<IRestaurant>;


export interface RestaurantsStats {
    restaurantsCount: number;
}
