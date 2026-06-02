'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comentario extends Model {
    static associate(models) {
      comentario.belongsTo(models.Usuario,
        { foreignKey: 'id_usuario' });
      comentario.belongsTo(models.Publicacion,
        { foreignKey: 'id_publicacion' });
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