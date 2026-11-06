import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../../../config/database";
import { Hotel } from "../../hotels/models/hotel.model";
import { Amenity } from "../../../modules/amenities/models/amenity.model";
import { RoomTypeAmenity } from "../../../modules/amenities/models/room-type-amenity.model";
import { RoomImage } from "./room-image.model";
import { RoomTypeRate } from "./room-type-rate.model";

export class RoomType extends Model<
  InferAttributes<RoomType>,
  InferCreationAttributes<RoomType>
> {
  declare id: CreationOptional<string>;

  declare hotelId: string;

  declare name: string;
  declare slug: string;
  declare description: string | null;

  // PostgreSQL DECIMAL values are represented as strings.
  declare basePrice: string;

  declare maxAdults: CreationOptional<number>;
  declare maxChildren: CreationOptional<number>;
  declare maxOccupancy: CreationOptional<number>;

  declare bedType: string | null;
  declare bedCount: CreationOptional<number>;

  declare roomSizeSqm: string | null;

  declare isActive: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RoomType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    hotelId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "hotel_id",
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING(180),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    basePrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "base_price",
    },

    maxAdults: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      field: "max_adults",
    },

    maxChildren: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "max_children",
    },

    maxOccupancy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
      field: "max_occupancy",
    },

    bedType: {
      type: DataTypes.STRING(80),
      allowNull: true,
      field: "bed_type",
    },

    bedCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "bed_count",
    },

    roomSizeSqm: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      field: "room_size_sqm",
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
    modelName: "RoomType",
    tableName: "room_types",
    timestamps: true,
    underscored: true,
  }
);
