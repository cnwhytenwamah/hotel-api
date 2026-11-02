
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "email_verified_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "email_verification_token_hash", {
      type: Sequelize.STRING(64),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "email_verification_expires_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "password_reset_token_hash", {
      type: Sequelize.STRING(64),
      allowNull: true,
    });

    await queryInterface.addColumn("users", "password_reset_expires_at", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("users", "password_reset_expires_at");
    await queryInterface.removeColumn("users", "password_reset_token_hash");
    await queryInterface.removeColumn("users", "email_verification_expires_at");
    await queryInterface.removeColumn("users", "email_verification_token_hash");
    await queryInterface.removeColumn("users", "email_verified_at");
  },
};
