const express = require('express');
const router = express.Router();
const { Publicacion, Imagen, Usuario, Etiqueta } = require('../models');

router.get('/', async (req, res) => {
    const { etiqueta } = req.query;
    let publicaciones = [];  
    
    try {
        if (etiqueta) {
            const etiquetaEncontrada = await Etiqueta.findOne({
                where: { nombre: etiqueta.toLowerCase() }
            })

            if (etiquetaEncontrada) {
                publicaciones = await etiquetaEncontrada.getPublicaciones({
                    include: [
                        { model: Imagen, as: 'imagenes' },
                        Usuario,
                        { model: Etiqueta, as: 'etiquetas' }
                    ]
                });
            } else {
                publicaciones = [];
            }
        } else {
            // ← Solo si NO hay etiqueta, traer todas
            publicaciones = await Publicacion.findAll({
                include: [
                    { model: Imagen, as: "imagenes" },
                    Usuario,
                    { model: Etiqueta, as: "etiquetas" }
                ]
            });
        }

        res.render('publicaciones', {
            publicaciones,
            filtro: etiqueta || null
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar publicaciones");
    }
});

router.get('/:id', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(
            req.params.id,
            {
                include: [
                    { model: Imagen, as: 'imagenes' },
                    Usuario,
                    { model: Etiqueta, as: 'etiquetas' }
                ]
            }
        );

        if (!publicacion) {
            return res.send("Publicación no encontrada");
        }
        res.render('publicacion', { publicacion });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error");
    }
});

module.exports = router;