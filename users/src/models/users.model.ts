export interface IUser {
    id: number;

    firstname: string;
    lastname: string;
    mail: string;
    phone: string;
    password: string;
    roleId: number;

    thumbnail: string;
    city: string;
    cityCode: number;
    address: string;
    sponsorId: number;

    token: string;
    refreshToken: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface IRole {
  id: number;

  description: string;
  comment: string;

  createdAt: Date;
  updatedAt: Date;
}

export enum Roles {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  DELIVERY_MAN = 'DELIVERY_MAN',
  TECHNICAL_DEPARTMENT = 'TECHNICAL_DEPARTMENT',
  COMERCIAL_DEPARTMENT = 'COMERCIAL_DEPARTMENT',
  EXTERNAL = 'EXTERNAL'
}

import { Model, InferAttributes, InferCreationAttributes, CreationOptional, HasManyCreateAssociationMixin, NonAttribute, DataTypes, Optional } from 'sequelize';

// order of InferAttributes & InferCreationAttributes is important.
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;

    declare firstname: string;
    declare lastname: string;
    declare mail: string;
    declare phone: string;
    declare password: string;
    declare roleId: Role['id'];

    declare thumbnail: CreationOptional<string>;
    declare city: string;
    declare cityCode: number;
    declare address: string;
    declare sponsorId: CreationOptional<number>;

    declare token: CreationOptional<string>;
    declare refreshToken: CreationOptional<string>;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
  
    // getters that are not attributes should be tagged using NonAttribute
    // to remove them from the model's Attribute Typings.
    get fullName(): NonAttribute<string> {
      return `${this.firstname} ${this.lastname}`;
    }
}

// order of InferAttributes & InferCreationAttributes is important.
export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<number>;

  declare type: Roles;
  declare description: CreationOptional<string>;
  declare comment: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}