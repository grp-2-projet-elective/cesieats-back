import { Document, model, Model, Schema } from 'mongoose';

export interface IDelivery extends Document {
    order: object,
    restaurant: object,
    date: number,
    deliveryState: string,
    deliveryManId: number,
    customerId: number,
    location: {
        city: string,
        zipCode: string,
        address: string,
        latitude: number,
        longitude: number,
    },
}

export const DeliverySchema: Schema = new Schema({
    order: { type: Object, required: true },
    restaurant: { type: Object, required: true },
    date: { type: Number, required: true },
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

export interface DeliveriesStats {
    deliveriesCount: number;
}
