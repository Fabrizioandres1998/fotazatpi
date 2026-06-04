'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('me_interesa', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    
    await queryInterface.addIndex('me_interesa', ['id_usuario', 'id_publicacion'], {
      unique: true,
      name: 'unique_usuario_publicacion_interes'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('me_interesa');
  }
};