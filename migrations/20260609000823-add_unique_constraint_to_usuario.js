'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('usuario', 'username', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    });
    await queryInterface.changeColumn('usuario', 'email', {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('usuario', 'username', {
      type: Sequelize.STRING,
      unique: false
    });
    await queryInterface.changeColumn('usuario', 'email', {
      type: Sequelize.STRING,
      unique: false
    });
  }
};