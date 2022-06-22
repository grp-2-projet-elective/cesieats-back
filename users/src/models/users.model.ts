
import { CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';

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
  zipCode: number;
  address: string;
  sponsorId: number;

  accessToken: string;
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
  CUSTOMER = 1,
  RESTAURANT_OWNER = 2,
  DELIVERY_MAN = 3,
  TECHNICAL_DEPARTMENT = 4,
  COMERCIAL_DEPARTMENT = 5,
  EXTERNAL = 6
}


// order of InferAttributes & InferCreationAttributes is important.
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;

  declare firstname: string;
  declare lastname: string;
  declare mail: string;
  declare phone: string;
  declare password: string;
  declare roleId: number;

  declare thumbnail: CreationOptional<string>;
  declare city: string;
  declare zipCode: number;
  declare address: string;
  declare sponsorId: CreationOptional<number>;

  declare accessToken: CreationOptional<string>;
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