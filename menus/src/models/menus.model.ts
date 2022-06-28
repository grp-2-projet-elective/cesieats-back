import { model, Schema, Model, Document } from 'mongoose';

export interface IMenu extends Document {
    name: string,
    description?: string,
    products: Array<number>,
    restaurant: object,
    price: number,
    image: string,
}

export const MenuSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: false },
    products: { type: Array, required: true },
    restaurant: { type: Object, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
});

export const Menu: Model<IMenu> = model('Menu', MenuSchema);

export interface MenusStats {
    menusCount: number;
}