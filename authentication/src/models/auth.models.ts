import { Document, model, Model, Schema } from "mongoose";

export interface IUserInformation extends Document {
    userId: Number,
    token: string
}

export const UserInformationSchema: Schema = new Schema({
    userId: { type: Number, required: true },
    token: { type: String, required: true }
});

export const UserInformation: Model<IUserInformation> = model('UserInformation', UserInformationSchema);