'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reporte_comentario', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_comentario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'comentario',
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
      motivo: {
        type: Sequelize.ENUM('spam', 'contenido_inapropiado', 'violencia', 'odio', 'copyright'),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
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
    
    await queryInterface.addIndex('reporte_comentario', ['id_usuario', 'id_comentario'], {
      unique: true,
      name: 'unique_usuario_comentario_reporte'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reporte_comentario');
  }
};