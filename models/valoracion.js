'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Valoracion extends Model {
    static associate(models) {
      Valoracion.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
      Valoracion.belongsTo(models.Publicacion, { foreignKey: 'id_publicacion', as: 'publicacion' });
    }
  }
  
  Valoracion.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    puntaje: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    }
  }, {
    sequelize,
    modelName: 'Valoracion',
    tableName: 'valoracion',
    timestamps: true
  });
  
  return Valoracion;
};