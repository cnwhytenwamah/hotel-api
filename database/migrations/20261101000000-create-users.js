"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },

      phone: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },

      password_hash: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      account_type: {
        type: Sequelize.ENUM("guest", "staff"),
        allowNull: false,
        defaultValue: "guest",
      },

      status: {
        type: Sequelize.ENUM("active", "suspended"),
        allowNull: false,
        defaultValue: "active",
      },

      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable("users");

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_account_type";'
    );

    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_status";'
    );
  },
};