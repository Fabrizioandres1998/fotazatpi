'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reporte_publicacion extends Model {
    static associate(models) {
      reporte_publicacion.belongsTo(models.Publicacion, { foreignKey: 'id_publicacion', as: 'publicacion' });
      reporte_publicacion.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
    }
  }

  reporte_publicacion.init({
    id_publicacion: {
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
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'revisado', 'resuelto'),
      defaultValue: 'pendiente',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'reporte_publicacion',
    tableName: 'reporte_publicacion',
    timestamps: true
  });

  return reporte_publicacion;
};