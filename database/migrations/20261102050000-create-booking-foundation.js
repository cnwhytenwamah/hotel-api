"use strict";

const { DataTypes, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // 1. Main bookings table
    await queryInterface.createTable("bookings", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      hotel_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "hotels", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      booking_reference: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
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
      payment_status: {
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
      },
      check_in_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
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
      room_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      primary_guest_name: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      primary_guest_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      primary_guest_phone: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      guest_country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      special_requests: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      subtotal: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tax_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      service_charge: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: "NGN",
      },
      confirmed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("bookings", ["hotel_id"]);
    await queryInterface.addIndex("bookings", ["user_id"]);
    await queryInterface.addIndex("bookings", ["status"]);
    await queryInterface.addIndex("bookings", ["payment_status"]);
    await queryInterface.addIndex("bookings", ["check_in_date", "check_out_date"]);
    await queryInterface.addIndex("bookings", ["hotel_id", "created_at"]);

    await queryInterface.addConstraint("bookings", {
      fields: ["check_in_date", "check_out_date"],
      type: "check",
      name: "bookings_valid_date_range",
      where: Sequelize.literal("check_out_date > check_in_date"),
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["adults"],
      type: "check",
      name: "bookings_adults_positive",
      where: Sequelize.literal("adults >= 1"),
    });

    await queryInterface.addConstraint("bookings", {
      fields: ["children", "room_count"],
      type: "check",
      name: "bookings_children_and_rooms_valid",
      where: Sequelize.literal("children >= 0 AND room_count >= 1"),
    });

    // 2. Physical rooms assigned to each booking
    await queryInterface.createTable("booking_rooms", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      booking_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "bookings", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      room_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "room_types", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      room_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "rooms", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("booking_rooms", ["booking_id"]);
    await queryInterface.addIndex("booking_rooms", ["room_id"]);

    // 3. Guests associated with a booking
    await queryInterface.createTable("booking_guests", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      booking_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "bookings", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      booking_room_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: "booking_rooms", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      is_primary: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("booking_guests", ["booking_id"]);
    await queryInterface.addIndex("booking_guests", ["booking_room_id"]);

    // 4. Temporary booking holds
    await queryInterface.createTable("booking_holds", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      hotel_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "hotels", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      booking_id: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        references: { model: "bookings", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      token_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      check_in_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      check_out_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("active", "converted", "expired", "released"),
        allowNull: false,
        defaultValue: "active",
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("booking_holds", ["hotel_id", "status", "expires_at"]);
    await queryInterface.addIndex("booking_holds", ["check_in_date", "check_out_date"]);

    await queryInterface.addConstraint("booking_holds", {
      fields: ["check_in_date", "check_out_date"],
      type: "check",
      name: "booking_holds_valid_date_range",
      where: Sequelize.literal("check_out_date > check_in_date"),
    });

    // 5. Physical rooms reserved by each hold
    await queryInterface.createTable("booking_hold_rooms", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      hold_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "booking_holds", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      room_type_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "room_types", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      room_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "rooms", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addConstraint("booking_hold_rooms", {
      fields: ["hold_id", "room_id"],
      type: "unique",
      name: "booking_hold_rooms_unique_room",
    });

    await queryInterface.addIndex("booking_hold_rooms", ["room_id"]);

    // 6. Snapshot of the price charged for each room on each night
    await queryInterface.createTable("booking_room_nights", {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      booking_room_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "booking_rooms", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      stay_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      nightly_rate: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      rate_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addConstraint("booking_room_nights", {
      fields: ["booking_room_id", "stay_date"],
      type: "unique",
      name: "booking_room_nights_unique_stay",
    });

    await queryInterface.addConstraint("booking_room_nights", {
      fields: ["nightly_rate"],
      type: "check",
      name: "booking_room_nights_positive_rate",
      where: Sequelize.literal("nightly_rate > 0"),
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("booking_room_nights");
    await queryInterface.dropTable("booking_hold_rooms");
    await queryInterface.dropTable("booking_holds");
    await queryInterface.dropTable("booking_guests");
    await queryInterface.dropTable("booking_rooms");
    await queryInterface.dropTable("bookings");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_bookings_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_bookings_payment_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_booking_holds_status";'
    );
  },
};