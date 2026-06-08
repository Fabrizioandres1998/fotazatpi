'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reporte_comentario extends Model {
    static associate(models) {
      reporte_comentario.belongsTo(models.comentario, { foreignKey: 'id_comentario', as: 'comentario' });
      reporte_comentario.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
    }
  }
  
  reporte_comentario.init({
    id_comentario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.ENUM('spam', 'contenido_inapropiado', 'violencia', 'odio', 'copyright'),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'reporte_comentario',
    tableName: 'reporte_comentario',
    timestamps: true
  });
  
  return reporte_comentario;
};