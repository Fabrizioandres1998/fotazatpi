'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Publicacion extends Model {
    static associate(models) {
      Publicacion.belongsTo(models.Usuario, { foreignKey: "id_usuario" });
      Publicacion.hasMany(models.Imagen, { foreignKey: "id_publicacion", as: "imagenes" });
      Publicacion.hasMany(models.Valoracion, { foreignKey: 'id_publicacion', as: 'valoraciones' });
      Publicacion.belongsToMany(models.Etiqueta, {
        through: 'publicacion_etiqueta',
        foreignKey: 'id_publicacion',
        otherKey: 'id_etiqueta',
        as: 'etiquetas'
      });
      Publicacion.hasMany(models.reporte_publicacion, { foreignKey: 'id_publicacion', as: 'reportes' });
      Publicacion.hasMany(models.me_interesa, { foreignKey: 'id_publicacion', as: 'interesados' });
      Publicacion.hasMany(models.notificacion, { foreignKey: 'id_publicacion', as: 'notificaciones' });
      Publicacion.hasMany(models.comentario, { foreignKey: 'id_publicacion', as: 'comentarios' });
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