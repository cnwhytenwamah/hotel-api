
import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";

import { sequelize } from "../../../config/database";

export class RoomTypeRate extends Model<
  InferAttributes<RoomTypeRate>,
  InferCreationAttributes<RoomTypeRate>
> {
  declare id: CreationOptional<string>;
  declare roomTypeId: string;
  declare name: string;
  declare startDate: string;
  declare endDate: string;
  declare nightlyRate: string;
  declare minimumStay: CreationOptional<number>;
  declare priority: CreationOptional<number>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RoomTypeRate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "room_type_id",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "start_date",
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "end_date",
    },
    nightlyRate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "nightly_rate",
    },
    minimumStay: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "minimum_stay",
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    tableName: "room_type_rates",
    timestamps: true,
    underscored: true,
  }
);


