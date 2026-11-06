import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/database";

export class BookingRoomNight extends Model<
  InferAttributes<BookingRoomNight>,
  InferCreationAttributes<BookingRoomNight>
> {
  declare id: CreationOptional<string>;
  declare bookingRoomId: string;
  declare stayDate: string;
  declare nightlyRate: string;
  declare rateName: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BookingRoomNight.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bookingRoomId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "booking_room_id",
    },
    stayDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: "stay_date",
    },
    nightlyRate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "nightly_rate",
    },
    rateName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "rate_name",
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
    tableName: "booking_room_nights",
    timestamps: true,
    underscored: true,
  }
);