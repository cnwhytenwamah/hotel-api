
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user_sessions", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      token_hash: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },

      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      revoked_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      replaced_by_session_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "user_sessions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },

      user_agent: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      ip_address: {
        type: Sequelize.STRING(45),
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

    await queryInterface.addIndex("user_sessions", ["user_id"], {
      name: "user_sessions_user_id_idx",
    });

    await queryInterface.addIndex("user_sessions", ["expires_at"], {
      name: "user_sessions_expires_at_idx",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("user_sessions");
  },
};