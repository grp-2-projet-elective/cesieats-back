
import { RoleTypes } from '@grp-2-projet-elective/cesieats-helpers';
import { CreationOptional, InferAttributes, InferCreationAttributes, Model, NonAttribute } from 'sequelize';

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
  declare referalCode: CreationOptional<string>;

  declare refreshToken: CreationOptional<string>;
  declare isSuspended: boolean;

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

  declare type: RoleTypes;
  declare description: CreationOptional<string>;
  declare comment: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export interface UsersStats {
  usersCount: number;

  customersCount: number;
  restaurantOwnersCount: number;
  deliveryMansCount: number;
  technicalDepartmentCount: number;
  comercialDepartmentsCount: number;
  externalsCount: number;

  citiesCount: number;
}