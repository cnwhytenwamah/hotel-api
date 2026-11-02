
import {
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
} from "sequelize";

import { sequelize } from "../../../config/database";
import { Hotel } from "../../hotels/models/hotel.model";
import { RoomType } from "../../room-types/models/room-type.model";

export type RoomStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "cleaning"
  | "maintenance"
  | "out_of_service";

export class Room extends Model<
  InferAttributes<Room>,
  InferCreationAttributes<Room>
> {
  declare id: CreationOptional<string>;
  declare hotelId: string;
  declare roomTypeId: string;
  declare roomNumber: string;
  declare floor: CreationOptional<number | null>;
declare notes: CreationOptional<string | null>;
  declare status: CreationOptional<RoomStatus>;
  declare isActive: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Room.init(
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
    roomTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "room_type_id",
    },
    roomNumber: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "room_number",
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "available",
        "occupied",
        "reserved",
        "cleaning",
        "maintenance",
        "out_of_service"
      ),
      allowNull: false,
      defaultValue: "available",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: "rooms",
    timestamps: true,
    underscored: true,
  }
);

Room.belongsTo(Hotel, {
  foreignKey: "hotelId",
  as: "hotel",
});

Room.belongsTo(RoomType, {
  foreignKey: "roomTypeId",
  as: "roomType",
});
