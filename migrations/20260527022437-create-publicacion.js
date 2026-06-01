'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('publicacion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      titulo: {
        type: Sequelize.STRING,
        allowNull: false
      },

      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Publicacion');
  }
};