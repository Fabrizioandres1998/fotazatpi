'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class me_interesa extends Model {
    static associate(models) {
      me_interesa.belongsTo(models.Publicacion, { foreignKey: 'id_publicacion', as: 'publicacion' });
      me_interesa.belongsTo(models.Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
    }
  }
  
  me_interesa.init({
    id_publicacion: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'me_interesa',
    tableName: 'me_interesa',
    timestamps: true
  });
  
  return me_interesa;
};