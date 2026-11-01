import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";

import { sequelize } from "../../../config/database";

export class Hotel extends Model<
  InferAttributes<Hotel>,
  InferCreationAttributes<Hotel>
> {
  declare id: CreationOptional<string>;

  declare name: string;
  declare slug: string;

  declare email: string | null;
  declare phone: string | null;

  declare timezone: CreationOptional<string>;
  declare currency: CreationOptional<string>;

  declare isActive: CreationOptional<boolean>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Hotel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Hotel name is required.",
        },
      },
    },

    slug: {
      type: DataTypes.STRING(180),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: "Hotel slug is required.",
        },
      },
    },

    email: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: {
          msg: "Please provide a valid hotel email address.",
        },
      },
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    timezone: {
      type: DataTypes.STRING(60),
      allowNull: false,
      defaultValue: "Africa/Lagos",
    },

    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "NGN",
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
    modelName: "Hotel",
    tableName: "hotels",

    timestamps: true,
    underscored: true,
  }
);