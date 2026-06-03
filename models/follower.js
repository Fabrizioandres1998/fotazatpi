'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class follower extends Model {
    static associate(models) {
      // El seguidr pertenece a un usuario (el que sigue)
      follower.belongsTo(models.Usuario, { 
        foreignKey: 'id_seguidor',
        as: 'seguidor'
      });
      
      // el seguido pertenece a un usuario (el que es seguido)
      follower.belongsTo(models.Usuario, { 
        foreignKey: 'id_seguido',
        as: 'seguido'
      });
    }
  }
  
  follower.init({
    id_seguidor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_seguido: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'follower',
    tableName: 'follower',
    timestamps: true
  });
  
  return follower;
};