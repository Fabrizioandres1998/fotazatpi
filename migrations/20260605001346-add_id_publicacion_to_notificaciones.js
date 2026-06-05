'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notificaciones', 'id_publicacion', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'publicacion',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('notificaciones', 'id_publicacion');
  }
};