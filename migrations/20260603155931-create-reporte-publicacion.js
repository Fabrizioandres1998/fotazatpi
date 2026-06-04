'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reporte_publicacion', {
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
      motivo: {
        type: Sequelize.ENUM('spam', 'contenido_inapropiado', 'violencia', 'odio', 'copyright', 'otro'),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'revisado', 'resuelto'),
        defaultValue: 'pendiente',
        allowNull: false
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
    
    await queryInterface.addIndex('reporte_publicacion', ['id_usuario', 'id_publicacion'], {
      unique: true,
      name: 'unique_usuario_publicacion_reporte'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reporte_publicacion');
  }
};