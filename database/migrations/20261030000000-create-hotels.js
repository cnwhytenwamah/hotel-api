"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("hotels", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      slug: {
        type: Sequelize.STRING(180),
        allowNull: false,
        unique: true,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },

      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      timezone: {
        type: Sequelize.STRING(60),
        allowNull: false,
        defaultValue: "Africa/Lagos",
      },

      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: "NGN",
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable("hotels");
  },
};