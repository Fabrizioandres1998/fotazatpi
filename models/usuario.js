'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Publicacion, { foreignKey: "id_usuario" });
      Usuario.hasMany(models.comentario, { foreignKey: 'id_usuario' });
      Usuario.hasMany(models.Valoracion, { foreignKey: 'id_usuario', as: 'valoraciones' });
      // usuarios que sigo
      Usuario.belongsToMany(models.Usuario, {
        through: 'follower',
        as: 'seguidos',
        foreignKey: 'id_seguidor',
        otherKey: 'id_seguido'
      });
      Usuario.hasMany(models.reporte_publicacion, { foreignKey: 'id_usuario', as: 'reportes' });
      Usuario.hasMany(models.me_interesa, { foreignKey: 'id_usuario', as: 'intereses' });
      Usuario.hasMany(models.notificacion, { foreignKey: 'id_usuario_destino', as: 'notificaciones_recibidas' });
      Usuario.hasMany(models.notificacion, { foreignKey: 'id_usuario_origen', as: 'notificaciones_enviadas' });
      Usuario.hasMany(models.coleccion, { foreignKey: 'id_usuario', as: 'colecciones' });
      // Usuarios que me siguen
      Usuario.belongsToMany(models.Usuario, {
        through: 'follower',
        as: 'seguidores',
        foreignKey: 'id_seguido',
        otherKey: 'id_seguidor'
      });
    }
  }

  Usuario.init({
    username: {
      type: DataTypes.STRING,
      unique: true,  
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true, 
      allowNull: false
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING,
      defaultValue: 'usuario'
    },
    publicaciones_eliminadas: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuario'
  });
  return Usuario;
};