import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/database";

export class BookingGuest extends Model<
  InferAttributes<BookingGuest>,
  InferCreationAttributes<BookingGuest>
> {
  declare id: CreationOptional<string>;
  declare bookingId: string;
  declare bookingRoomId: CreationOptional<string | null>;
  declare firstName: string;
  declare lastName: string;
  declare email: CreationOptional<string | null>;
  declare phone: CreationOptional<string | null>;
  declare country: CreationOptional<string | null>;
  declare isPrimary: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BookingGuest.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "booking_id",
    },
    bookingRoomId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "booking_room_id",
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "last_name",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "is_primary",
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
    tableName: "booking_guests",
    timestamps: true,
    underscored: true,
  }
);