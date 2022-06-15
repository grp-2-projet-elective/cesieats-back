import { model, Schema, Model, Document } from 'mongoose';

export interface IDelivery extends Document {
    title: string,
    subtitle?: string,
    date: string,
    description?: string
}

export const DeliverySchema: Schema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    date: { type: String, required: true },
    description: { type: String, required: false }
});

export const Delivery: Model<IDelivery> = model('Delivery', DeliverySchema);