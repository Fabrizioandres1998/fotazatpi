'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('publicacion_etiqueta', {

      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      id_publicacion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'publicacion',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      id_etiqueta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'etiqueta',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.dropTable('publicacion_etiqueta');

  }
};
