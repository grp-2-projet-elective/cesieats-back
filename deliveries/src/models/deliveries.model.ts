import { Document, model, Model, Schema } from 'mongoose';

export interface IDelivery extends Document {
    orderId: number,
    restaurant: object,
    date: Date,
    deliveryState: string,
    deliveryManId: number,
    customerId: number,
    location: {
        city: string,
        zipCode: number,
        address: string,
        latitude: number,
        longitude: number,
    },
}

export const DeliverySchema: Schema = new Schema({
    orderId: { type: Number, required: true },
    restaurant: { type: Object, required: true },
    date: { type: Date, required: true },
    deliveryState: { type: String, required: true },
    deliveryManId: { type: Number, required: true },
    customerId: { type: Number, required: true },
    location: {
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        address: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
});

export const Delivery: Model<IDelivery> = model('Delivery', DeliverySchema);