
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rooms", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      hotel_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "hotels",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      room_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "room_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      room_number: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      floor: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM(
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
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addConstraint("rooms", {
      fields: ["hotel_id", "room_number"],
      type: "unique",
      name: "rooms_hotel_id_room_number_unique",
    });

    await queryInterface.addIndex("rooms", ["hotel_id"]);
    await queryInterface.addIndex("rooms", ["room_type_id"]);
    await queryInterface.addIndex("rooms", ["status"]);
    await queryInterface.addIndex("rooms", ["is_active"]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("rooms");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_rooms_status";'
    );
  },
};
