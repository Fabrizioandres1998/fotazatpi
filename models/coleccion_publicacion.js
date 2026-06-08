'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coleccion_publicacion extends Model {
    static associate(models) {
      coleccion_publicacion.belongsTo(models.coleccion, { foreignKey: 'id_coleccion', as: 'coleccion' });
      coleccion_publicacion.belongsTo(models.Publicacion, { foreignKey: 'id_publicacion', as: 'publicacion' });
    }
  }
  
  coleccion_publicacion.init({
    id_coleccion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'coleccion_publicacion',
    tableName: 'coleccion_publicacion',
    timestamps: true
  });
  
  return coleccion_publicacion;
};