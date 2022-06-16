export interface IUser {
    id: string,
    string?: string,
    date: string,
    description?: string
}

import { Model, InferAttributes, InferCreationAttributes, CreationOptional, HasManyCreateAssociationMixin, NonAttribute, DataTypes } from 'sequelize';

// order of InferAttributes & InferCreationAttributes is important.
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;

    declare username: string;
    declare firstname: string;
    declare lastname: string;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get fullName(): NonAttribute<string> {
      return this.username;
    }
}