'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Imagen extends Model {
    static associate(models) {
      Imagen.belongsTo(models.Publicacion, {
        foreignKey: "id_publicacion"
      });
    }
  }
  
  Imagen.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    marca_agua: {
      type: DataTypes.STRING,
      allowNull: true
    },
    licencia: {
      type: Sequelize.ENUM("copyright", "sin_copyright"),
      allowNull: false
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'publicacion',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Imagen',
    tableName: 'imagen'
  });
  
  return Imagen;
};