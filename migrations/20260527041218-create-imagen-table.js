'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('imagen', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      marca_agua: {
        type: Sequelize.STRING,
        allowNull: true
      },
      licencia: {
        type: Sequelize.ENUM("copyright", "sin_copyright"),
        allowNull: false,
        defaultValue: "sin_copyright"
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
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('imagen');
  }
};