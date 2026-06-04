'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.hasMany(models.Publicacion, { foreignKey: "id_usuario" });
      Usuario.hasMany(models.comentario, { foreignKey: 'id_usuario' });
      Usuario.hasMany(models.Valoracion, { foreignKey: 'id_usuario', as: 'valoraciones' });
      // usuarios que SIGO (mis seguidos)
      Usuario.belongsToMany(models.Usuario, {
        through: 'follower',
        as: 'seguidos',
        foreignKey: 'id_seguidor',
        otherKey: 'id_seguido'
      });
      Usuario.hasMany(models.reporte_publicacion, { foreignKey: 'id_usuario', as: 'reportes' });
      // Usuarios que me SIGUEN (mis seguidores)
      Usuario.belongsToMany(models.Usuario, {
        through: 'follower',
        as: 'seguidores',
        foreignKey: 'id_seguido',
        otherKey: 'id_seguidor'
      });
    }
  }

  Usuario.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
      allowNull: false     
    },
    rol: DataTypes.STRING,
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