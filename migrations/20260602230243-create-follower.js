'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('follower', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_seguidor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuario',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_seguido: {
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
    
    await queryInterface.addIndex('followers', ['id_seguidor', 'id_seguido'], {
      unique: true,
      name: 'unique_seguidor_seguido'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('followers');
  }
};