'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('valoracion', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario',
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
      puntaje: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5
        }
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
    
    await queryInterface.addIndex('valoracion', ['id_usuario', 'id_publicacion'], {
      unique: true,
      name: 'unique_usuario_publicacion'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('valoracion');
  }
};