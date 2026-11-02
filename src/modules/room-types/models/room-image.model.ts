
import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from "sequelize";

import { sequelize } from "../../../config/database";

export class RoomImage extends Model<
  InferAttributes<RoomImage>,
  InferCreationAttributes<RoomImage>
> {
  declare id: CreationOptional<string>;
  declare roomTypeId: string;
  declare imageUrl: string;
  declare publicId: string | null;
  declare altText: string | null;
  declare displayOrder: CreationOptional<number>;
  declare isPrimary: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

RoomImage.init(
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
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "image_url",
    },
    publicId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "public_id",
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "alt_text",
    },
    displayOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "display_order",
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
    tableName: "room_images",
    timestamps: true,
    underscored: true,
  }
);


