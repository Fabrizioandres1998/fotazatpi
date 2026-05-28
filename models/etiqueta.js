'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Etiqueta extends Model {

    static associate(models) {
      Etiqueta.belongsToMany(models.Publicacion, {
        through: 'publicacion_etiqueta',
        foreignKey: 'id_etiqueta',
        otherKey: 'id_publicacion',
        as: 'publicaciones'
      });
    }
  }
  Etiqueta.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Etiqueta',
    tableName: 'etiqueta'
  });
  return Etiqueta;
};