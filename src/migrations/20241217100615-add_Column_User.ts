import { QueryInterface, Sequelize, DataTypes } from "sequelize";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.addColumn("users", "forgotPasswordTime", {
      type: DataTypes.DATE,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.removeColumn("users", "forgotPasswordTime");
  },
};
