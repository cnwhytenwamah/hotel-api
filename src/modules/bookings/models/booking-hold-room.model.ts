import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/database";

export class BookingHoldRoom extends Model<
  InferAttributes<BookingHoldRoom>,
  InferCreationAttributes<BookingHoldRoom>
> {
  declare id: CreationOptional<string>;
  declare holdId: string;
  declare roomTypeId: string;
  declare roomId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BookingHoldRoom.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    holdId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "hold_id",
    },
    roomTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "room_type_id",
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "room_id",
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
    tableName: "booking_hold_rooms",
    timestamps: true,
    underscored: true,
  }
);