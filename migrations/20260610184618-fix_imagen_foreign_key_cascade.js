'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.removeConstraint('imagen', 'imagen_ibfk_1');

    await queryInterface.addConstraint('imagen', {
      fields: ['id_publicacion'],
      type: 'foreign key',
      name: 'imagen_ibfk_1',
      references: {
        table: 'publicacion',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('imagen', 'imagen_ibfk_1');
    await queryInterface.addConstraint('imagen', {
      fields: ['id_publicacion'],
      type: 'foreign key',
      name: 'imagen_ibfk_1',
      references: {
        table: 'publicacion',
        field: 'id'
      },
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE'
    });
  }
};