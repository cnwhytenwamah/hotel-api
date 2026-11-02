
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("room_images", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      room_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "room_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      public_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      alt_text: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      display_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

    await queryInterface.addIndex("room_images", ["room_type_id"]);
    await queryInterface.addIndex("room_images", ["room_type_id", "display_order"]);

    // A room type can have only one primary image.
    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX room_images_one_primary_per_type
      ON room_images (room_type_id)
      WHERE is_primary = TRUE;
    `);

    await queryInterface.createTable("room_type_rates", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      room_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "room_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      nightly_rate: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },
      minimum_stay: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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

    await queryInterface.addIndex("room_type_rates", ["room_type_id"]);
    await queryInterface.addIndex(
      "room_type_rates",
      ["room_type_id", "start_date", "end_date"]
    );

    await queryInterface.sequelize.query(`
      ALTER TABLE room_type_rates
      ADD CONSTRAINT room_type_rates_valid_date_range
      CHECK (end_date > start_date);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE room_type_rates
      ADD CONSTRAINT room_type_rates_positive_nightly_rate
      CHECK (nightly_rate > 0);
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE room_type_rates
      ADD CONSTRAINT room_type_rates_positive_minimum_stay
      CHECK (minimum_stay >= 1);
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable("room_type_rates");
    await queryInterface.dropTable("room_images");
  },
};
