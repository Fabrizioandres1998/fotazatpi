const express = require('express')
const router = express.Router()
const { Publicacion, Imagen, Usuario, Etiqueta } = require('../models');

// routes/perfil.js
// Muestra mi propio perfil (usando la sesión)
router.get('/', async (req, res, next) => {
    try {
        const { etiqueta } = req.query;
        let publicaciones;

        // Obtener el usuario actual desde la sesión
        const usuario = await Usuario.findByPk(req.session.id_usuario);

        // Si no hay usuario logueado, redirigir al login
        if (!usuario) {
            return res.redirect('/login');
        }

        // Si hay filtro por etiqueta
        if (etiqueta) {
            // busco la etiqueta por nombre
            const etiquetaEncontrada = await Etiqueta.findOne({
                where: { nombre: etiqueta.toLowerCase() }
            });

            if (etiquetaEncontrada) {
                // traigo mis publicaciones que tienen esta etiqueta
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
            // sin filtro, traigo todas mis publicaciones
            publicaciones = await Publicacion.findAll({
                where: { id_usuario: req.session.id_usuario },
                include: [
                    { model: Imagen, as: 'imagenes' },
                    { model: Etiqueta, as: 'etiquetas' }
                ],
                order: [['createdAt', 'DESC']]
            });
        }

        // renderizar la vista pasando los datos
        // esMiPerfil = true porque es mi propio perfil
        res.render('perfil', {
            usuario: usuario,
            publicaciones: publicaciones,
            filtro: etiqueta || null,
            esMiPerfil: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el perfil");
    }
})

// Muestra el perfil de otro usuario por nombre de usuario
router.get('/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const { etiqueta } = req.query;

        // Buscar el usuario por nombre de usuario
        const usuario = await Usuario.findOne({
            where: { username: username }
        });

        // Si no existe el usuario, error 404
        if (!usuario) {
            return res.status(404).send("Usuario no encontrado");
        }

        let publicaciones;

        // Si hay filtro por etiqueta
        if (etiqueta) {
            // busco la etiqueta por nombre
            const etiquetaEncontrada = await Etiqueta.findOne({
                where: { nombre: etiqueta.toLowerCase() }
            });

            if (etiquetaEncontrada) {
                // traigo las publicaciones de ese usuario que tienen esta etiqueta
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
            // sin filtro, traigo todas las publicaciones de ese usuario
            publicaciones = await Publicacion.findAll({
                where: { id_usuario: usuario.id },
                include: [
                    { model: Imagen, as: 'imagenes' },
                    { model: Etiqueta, as: 'etiquetas' }
                ],
                order: [['createdAt', 'DESC']]
            });
        }

        // deyerminar si es mi propio perfil 
        const esMiPerfil = req.session.id_usuario === usuario.id;

        // renderizar la vista pasando los datos
        res.render('perfil', {
            usuario: usuario,
            publicaciones: publicaciones,
            filtro: etiqueta || null,
            esMiPerfil: esMiPerfil
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el perfil");
    }
});

module.exports = router;