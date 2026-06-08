'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class coleccion extends Model {
    static associate(models) {
      coleccion.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
      coleccion.belongsToMany(models.Publicacion, {
        through: 'coleccion_publicacion',
        foreignKey: 'id_coleccion',
        otherKey: 'id_publicacion',
        as: 'publicaciones'
      });
    }
  }

  coleccion.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'coleccion',
    tableName: 'colecciones',
    timestamps: true
  });

  return coleccion;
};