import { model, Schema, Model, Document } from 'mongoose';

export interface IOrder extends Document {
    menus?: Array<object>,
    products?: Array<object>,
    restaurant: object,
    prices: {
        orderPrice: number,
        deliveryPrice: number,
        totalPrice: number,
    },
    date: number,
    orderState: string,
    customerId: number,
    location: {
        city: string,
        zipCode: string,
        address: string,
        latitude: number,
        longitude: number,
    },
}

export const OrderSchema: Schema = new Schema({
    menus: { type: Array, required: false },
    products: { type: Array, required: false },
    restaurant: { type: Object, required: true },
    prices: {
        orderPrice: { type: Number, required: true },
        deliveryPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
    },
    date: { type: Number, required: true },
    orderState: { type: String, required: true },
    customerId: { type: Number, required: true },
    location: {
        city: { type: String, required: true },
        zipCode: { type: String, required: true },
        address: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
});

export const Order: Model<IOrder> = model('Order', OrderSchema);

export interface OrdersStats {
    ordersCount: number;
}
