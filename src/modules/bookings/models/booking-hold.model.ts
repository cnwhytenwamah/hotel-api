import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/database";

export type BookingHoldStatus =
  | "active"
  | "converted"
  | "expired"
  | "released";

export class BookingHold extends Model<
  InferAttributes<BookingHold>,
  InferCreationAttributes<BookingHold>
> {
  declare id: CreationOptional<string>;
  declare hotelId: string;
  declare bookingId: CreationOptional<string | null>;
  declare tokenHash: string;
  declare checkInDate: string;
  declare checkOutDate: string;
  declare status: CreationOptional<BookingHoldStatus>;
  declare adults: number;
  declare children: CreationOptional<number>;
  declare roomCount: number;
  declare expiresAt: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BookingHold.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    hotelId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "hotel_id",
    },
    bookingId: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: true,
      field: "booking_id",
    },
    tokenHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      field: "token_hash",
    },
    checkInDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "check_in_date",
    },
    checkOutDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "check_out_date",
    },
    status: {
      type: DataTypes.ENUM("active", "converted", "expired", "released"),
      allowNull: false,
      defaultValue: "active",
    },
    adults: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    children: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    roomCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "room_count",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "expires_at",
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
    tableName: "booking_holds",
    timestamps: true,
    underscored: true,
  }
);