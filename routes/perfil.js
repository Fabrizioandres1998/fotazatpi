const express = require('express')
const router = express.Router()
const { Publicacion, Imagen, Usuario, Etiqueta, follower } = require('../models');

// Muestra mi perfil (usando la sesion)
router.get('/', async (req, res, next) => {
    try {
        const { etiqueta } = req.query;
        let publicaciones;

        const usuario = await Usuario.findByPk(req.session.id_usuario, {
            include: [
                { model: Usuario, as: 'seguidores', attributes: ['id', 'username'] },
                { model: Usuario, as: 'seguidos', attributes: ['id', 'username'] }
            ]
        });

        if (!usuario) {
            return res.redirect('/login');
        }

        if (etiqueta) {
            const etiquetaEncontrada = await Etiqueta.findOne({
                where: { nombre: etiqueta.toLowerCase() }
            });

            if (etiquetaEncontrada) {
                publicaciones = await etiquetaEncontrada.getPublicaciones({
                    where: { id_usuario: req.session.id_usuario },
                    include: [
                        { model: Imagen, as: 'imagenes' },
                        { model: Etiqueta, as: 'etiquetas' }
                    ],
                    order: [['createdAt', 'DESC']]
                });
            } else {
                publicaciones = [];
            }
        } else {
            publicaciones = await Publicacion.findAll({
                where: { id_usuario: req.session.id_usuario },
                include: [
                    { model: Imagen, as: 'imagenes' },
                    { model: Etiqueta, as: 'etiquetas' }
                ],
                order: [['createdAt', 'DESC']]
            });
        }

        res.render('perfil', {
            perfil: usuario,
            publicaciones: publicaciones,
            filtro: etiqueta || null,
            esMiPerfil: true,
            seguidoresCount: usuario.seguidores ? usuario.seguidores.length : 0,
            seguidosCount: usuario.seguidos ? usuario.seguidos.length : 0,
            siguiendo: false,
            seguidoresLista: usuario.seguidores || [],
            seguidosLista: usuario.seguidos || []
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el perfil: " + error.message);
    }
});

// muestra el perfil de otro usuario por nombre de usuario
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { etiqueta } = req.query;

        const usuario = await Usuario.findOne({
            where: { username: username },
            include: [
                { model: Usuario, as: 'seguidores', attributes: ['id', 'username'] },
                { model: Usuario, as: 'seguidos', attributes: ['id', 'username'] }
            ]
        });

        if (!usuario) {
            return res.status(404).send("Usuario no encontrado");
        }

        let publicaciones;

        if (etiqueta) {
            const etiquetaEncontrada = await Etiqueta.findOne({
                where: { nombre: etiqueta.toLowerCase() }
            });

            if (etiquetaEncontrada) {
                publicaciones = await etiquetaEncontrada.getPublicaciones({
                    where: { id_usuario: usuario.id },
                    include: [
                        { model: Imagen, as: 'imagenes' },
                        { model: Etiqueta, as: 'etiquetas' }
                    ],
                    order: [['createdAt', 'DESC']]
                });
            } else {
                publicaciones = [];
            }
        } else {
            publicaciones = await Publicacion.findAll({
                where: { id_usuario: usuario.id },
                include: [
                    { model: Imagen, as: 'imagenes' },
                    { model: Etiqueta, as: 'etiquetas' }
                ],
                order: [['createdAt', 'DESC']]
            });
        }

        const esMiPerfil = req.session.id_usuario === usuario.id;

        let siguiendo = false;
        if (req.session.id_usuario && !esMiPerfil) {
            const relacion = await follower.findOne({
                where: {
                    id_seguidor: req.session.id_usuario,
                    id_seguido: usuario.id
                }
            });
            siguiendo = !!relacion;
        }

        res.render('perfil', {
            perfil: usuario,
            publicaciones: publicaciones,
            filtro: etiqueta || null,
            esMiPerfil: esMiPerfil,
            seguidoresCount: usuario.seguidores ? usuario.seguidores.length : 0,
            seguidosCount: usuario.seguidos ? usuario.seguidos.length : 0,
            siguiendo: siguiendo,
            seguidoresLista: usuario.seguidores || [],
            seguidosLista: usuario.seguidos || []
        });

    } catch (error) {
        console.error('ERROR PERFIL:');
        console.error(error);
        console.error(error.stack);

        res.status(500).send("Error al cargar el perfil: " + error.message);
    }
});

module.exports = router;