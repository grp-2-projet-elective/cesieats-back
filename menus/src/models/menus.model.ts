import { model, Schema, Model, Document } from 'mongoose';

export interface IMenu extends Document {
    title: string,
    subtitle?: string,
    date: string,
    description?: string
}

export const MenuSchema: Schema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    date: { type: String, required: true },
    description: { type: String, required: false }
});

export const Menu: Model<IMenu> = model('Menu', MenuSchema);