
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("hotels", "description", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("hotels", "website", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("hotels", "logo_url", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });

    await queryInterface.addColumn("hotels", "address", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("hotels", "city", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("hotels", "state", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("hotels", "country", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });

    await queryInterface.addColumn("hotels", "postal_code", {
      type: Sequelize.STRING(30),
      allowNull: true,
    });

    await queryInterface.addColumn("hotels", "check_in_time", {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: "14:00",
    });

    await queryInterface.addColumn("hotels", "check_out_time", {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: "12:00",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("hotels", "check_out_time");
    await queryInterface.removeColumn("hotels", "check_in_time");
    await queryInterface.removeColumn("hotels", "postal_code");
    await queryInterface.removeColumn("hotels", "country");
    await queryInterface.removeColumn("hotels", "state");
    await queryInterface.removeColumn("hotels", "city");
    await queryInterface.removeColumn("hotels", "address");
    await queryInterface.removeColumn("hotels", "logo_url");
    await queryInterface.removeColumn("hotels", "website");
    await queryInterface.removeColumn("hotels", "description");
  },
};
