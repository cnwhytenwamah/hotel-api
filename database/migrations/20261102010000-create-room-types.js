
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("room_types", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING(180),
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      base_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
      },

      max_adults: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },

      max_children: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      max_occupancy: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
      },

      bed_type: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },

      bed_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      room_size_sqm: {
        type: Sequelize.DECIMAL(8, 2),
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
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("room_types", ["hotel_id", "slug"], {
      unique: true,
      name: "room_types_hotel_id_slug_unique",
    });

    await queryInterface.addIndex("room_types", ["hotel_id"], {
      name: "room_types_hotel_id_index",
    });

    await queryInterface.addIndex("room_types", ["is_active"], {
      name: "room_types_is_active_index",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("room_types");
  },
};
