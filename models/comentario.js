'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comentario extends Model {
    static associate(models) {
      comentario.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
      comentario.belongsTo(models.Publicacion, { foreignKey: 'id_publicacion', as: 'publicacion' });
      comentario.hasMany(models.reporte_comentario, { foreignKey: 'id_comentario', as: 'reportes' });
    }
  }
  
  comentario.init({
    texto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'comentario',
    tableName: 'comentario',
    timestamps: true
  });
  
  return comentario;
};