
import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../../../config/database";

export class RoomTypeAmenity extends Model<
  InferAttributes<RoomTypeAmenity>,
  InferCreationAttributes<RoomTypeAmenity>
> {
  declare roomTypeId: string;
  declare amenityId: string;
}

RoomTypeAmenity.init(
  {
    roomTypeId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: "room_type_id",
    },

    amenityId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      field: "amenity_id",
    },
  },
  {
    sequelize,
    modelName: "RoomTypeAmenity",
    tableName: "room_type_amenities",
    timestamps: false,
    underscored: true,
  }
);
