'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mensaje extends Model {
    static associate(models) {
      mensaje.belongsTo(models.Usuario, { foreignKey: 'id_remitente', as: 'remitente' });
      mensaje.belongsTo(models.Usuario, { foreignKey: 'id_destinatario', as: 'destinatario' });
      mensaje.belongsTo(models.Publicacion, { foreignKey: 'id_publicacion', as: 'publicacion' });
    }
  }
  
  mensaje.init({
    id_remitente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_destinatario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'mensaje',
    tableName: 'mensaje',
    timestamps: true
  });
  
  return mensaje;
};