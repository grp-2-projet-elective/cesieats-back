import { model, Schema, Model, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string,
    description?: string,
    restaurantId: number,
    price: number,
    image: string,
    categories?: Array<string>,
    isOutOfStock: boolean,
}

export const ProductSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    restaurantId: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    categories: { type: Array, required: true },
    isOutOfStock: { type: Boolean, required: true },
});

export const Product: Model<IProduct> = model('Product', ProductSchema);