const express = require('express')
const router = express.Router()
const { Publicacion, Imagen, Usuario, Etiqueta } = require('../models');

// routes/perfil.js
router.get('/', async (req, res, next) => {
    try {
        const { etiqueta } = req.query;
        let publicaciones;

        if (etiqueta) {
            // busco la etiqueta
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
            // sin filtro, todas mis publicaciones
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
            publicaciones: publicaciones,
            filtro: etiqueta || null  
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el perfil");
    }
})
module.exports = router