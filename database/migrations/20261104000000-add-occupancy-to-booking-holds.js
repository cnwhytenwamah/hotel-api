"use strict";

const { DataTypes, Sequelize } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn("booking_holds", "adults", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addColumn("booking_holds", "children", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn("booking_holds", "room_count", {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addConstraint("booking_holds", {
      fields: ["adults"],
      type: "check",
      name: "booking_holds_adults_positive",
      where: Sequelize.literal("adults >= 1"),
    });

    await queryInterface.addConstraint("booking_holds", {
      fields: ["children", "room_count"],
      type: "check",
      name: "booking_holds_children_rooms_valid",
      where: Sequelize.literal(
        "children >= 0 AND room_count >= 1"
      ),
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "booking_holds",
      "booking_holds_children_rooms_valid"
    );

    await queryInterface.removeConstraint(
      "booking_holds",
      "booking_holds_adults_positive"
    );

    await queryInterface.removeColumn("booking_holds", "room_count");
    await queryInterface.removeColumn("booking_holds", "children");
    await queryInterface.removeColumn("booking_holds", "adults");
  },
};