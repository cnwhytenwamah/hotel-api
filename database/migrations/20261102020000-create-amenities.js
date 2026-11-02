"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("amenities", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },

      slug: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      icon: {
        type: Sequelize.STRING(100),
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

    await queryInterface.createTable("room_type_amenities", {
      room_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "room_types",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      amenity_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: "amenities",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });

    await queryInterface.addIndex(
      "room_type_amenities",
      ["amenity_id"],
      { name: "room_type_amenities_amenity_id_index" }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("room_type_amenities");
    await queryInterface.dropTable("amenities");
  },
};