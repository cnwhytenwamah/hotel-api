import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../../../config/database";

export type BookingStatus =
  | "pending"
  | "awaiting_payment"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show"
  | "expired";

export type BookingPaymentStatus =
  | "unpaid"
  | "pending"
  | "paid"
  | "partially_refunded"
  | "refunded"
  | "failed";

export class Booking extends Model<
  InferAttributes<Booking>,
  InferCreationAttributes<Booking>
> {
  declare id: CreationOptional<string>;
  declare hotelId: string;
  declare userId: string | null;
  declare bookingReference: string;
  declare status: CreationOptional<BookingStatus>;
  declare paymentStatus: CreationOptional<BookingPaymentStatus>;
  declare checkInDate: string;
  declare checkOutDate: string;
  declare adults: number;
  declare children: CreationOptional<number>;
  declare roomCount: number;
  declare primaryGuestName: string;
  declare primaryGuestEmail: string;
  declare primaryGuestPhone: string;
  declare guestCountry: CreationOptional<string | null>;
  declare specialRequests: CreationOptional<string | null>;
  declare subtotal: string;
  declare discountAmount: CreationOptional<string>;
  declare taxAmount: CreationOptional<string>;
  declare serviceCharge: CreationOptional<string>;
  declare totalAmount: string;
  declare currency: CreationOptional<string>;
  declare confirmedAt: CreationOptional<Date | null>;
  declare cancelledAt: CreationOptional<Date | null>;
  declare cancellationReason: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare bookingRooms?: NonAttribute<unknown[]>;
  declare guests?: NonAttribute<unknown[]>;
}

Booking.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "user_id",
    },
    bookingReference: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      field: "booking_reference",
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "awaiting_payment",
        "confirmed",
        "checked_in",
        "checked_out",
        "cancelled",
        "no_show",
        "expired"
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM(
        "unpaid",
        "pending",
        "paid",
        "partially_refunded",
        "refunded",
        "failed"
      ),
      allowNull: false,
      defaultValue: "unpaid",
      field: "payment_status",
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
    primaryGuestName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "primary_guest_name",
    },
    primaryGuestEmail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "primary_guest_email",
    },
    primaryGuestPhone: {
      type: DataTypes.STRING(30),
      allowNull: false,
      field: "primary_guest_phone",
    },
    guestCountry: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "guest_country",
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "special_requests",
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    discountAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "discount_amount",
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "tax_amount",
    },
    serviceCharge: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "service_charge",
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "total_amount",
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "NGN",
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "confirmed_at",
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "cancelled_at",
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "cancellation_reason",
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
    tableName: "bookings",
    timestamps: true,
    underscored: true,
  }
);