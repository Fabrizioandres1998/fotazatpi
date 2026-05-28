'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Publicacion extends Model {
    static associate(models) {
      Publicacion.belongsTo(models.Usuario, {
        foreignKey: "id_usuario"
      });
      Publicacion.hasMany(models.Imagen, {
        foreignKey: "id_publicacion",
        as: "imagenes"
      });
      Publicacion.belongsToMany(models.Etiqueta, {
        through: 'publicacion_etiqueta',
        foreignKey: 'id_publicacion',
        otherKey: 'id_etiqueta',
        as: 'etiquetas'
      });
    }
  }

  Publicacion.init({
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuario',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Publicacion',
    tableName: 'publicacion'
  });

  return Publicacion;
};