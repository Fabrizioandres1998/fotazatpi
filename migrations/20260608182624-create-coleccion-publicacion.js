'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coleccion_publicacion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_coleccion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'colecciones',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('coleccion_publicacion', ['id_coleccion', 'id_publicacion'], {
      unique: true,
      name: 'unique_coleccion_publicacion'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coleccion_publicacion');
  }
};