'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class notificacion extends Model {
    static associate(models) {
      notificacion.belongsTo(models.Usuario, { foreignKey: 'id_usuario_destino', as: 'destino' });
      notificacion.belongsTo(models.Usuario, { foreignKey: 'id_usuario_origen', as: 'origen' });
      notificacion.belongsTo(models.Publicacion, { foreignKey: 'id_publicacion', as: 'publicacion' });
    }
  }
  
  notificacion.init({
    id_usuario_destino: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_usuario_origen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    leida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'notificacion',
    tableName: 'notificaciones',
    timestamps: true
  });
  
  return notificacion;
};