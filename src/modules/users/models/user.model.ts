import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,} from "sequelize";

import { sequelize } from "../../../config/database";

export type AccountType = "guest" | "staff";
export type UserStatus = "active" | "suspended";

export class User extends Model< InferAttributes<User>,  InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;

  declare firstName: string;
  declare lastName: string;

  declare email: string;
  declare phone: string | null;

  declare passwordHash: string;

  declare accountType: CreationOptional<AccountType>;
  declare status: CreationOptional<UserStatus>;

  declare lastLoginAt: Date | null;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare emailVerifiedAt: CreationOptional<Date | null>;
declare emailVerificationTokenHash: CreationOptional<string | null>;
declare emailVerificationExpiresAt: CreationOptional<Date | null>;
declare passwordResetTokenHash: CreationOptional<string | null>;
declare passwordResetExpiresAt: CreationOptional<Date | null>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "password_hash",
    },

    accountType: {
      type: DataTypes.ENUM("guest", "staff"),
      allowNull: false,
      defaultValue: "guest",
      field: "account_type",
    },

    status: {
      type: DataTypes.ENUM("active", "suspended"),
      allowNull: false,
      defaultValue: "active",
    },

    emailVerifiedAt: {
  type: DataTypes.DATE,
  allowNull: true,
  field: "email_verified_at",
},

emailVerificationTokenHash: {
  type: DataTypes.STRING(64),
  allowNull: true,
  field: "email_verification_token_hash",
},

emailVerificationExpiresAt: {
  type: DataTypes.DATE,
  allowNull: true,
  field: "email_verification_expires_at",
},

passwordResetTokenHash: {
  type: DataTypes.STRING(64),
  allowNull: true,
  field: "password_reset_token_hash",
},

passwordResetExpiresAt: {
  type: DataTypes.DATE,
  allowNull: true,
  field: "password_reset_expires_at",
},

    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "last_login_at",
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
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);