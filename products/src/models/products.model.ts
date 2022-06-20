import { model, Schema, Model, Document } from 'mongoose';

export interface IProduct extends Document {
    title: string,
    subtitle?: string,
    date: string,
    description?: string
}

export const ProductSchema: Schema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    date: { type: String, required: true },
    description: { type: String, required: false }
});

export const Product: Model<IProduct> = model('Product', ProductSchema);