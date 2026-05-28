const express = require('express');
const router = express.Router();
const { Publicacion, Imagen, Usuario, Etiqueta } = require('../models');

router.get('/', async (req, res) => {

    try {

        const publicaciones = await Publicacion.findAll({
            include: [
                {
                    model: Imagen,
                    as: "imagenes"
                },
                Usuario,
                {
                    model: Etiqueta,
                    as: "etiquetas"
                }
            ]
        });

        console.log(
            publicaciones[0]?.toJSON()
        );

        res.render('publicaciones', {
            publicaciones
        });

    } catch (error) {
        console.log(error);
    }

});

router.get('/:id', async (req, res) => {

    try {
        const publicacion = await Publicacion.findByPk(
            req.params.id,
            {
                include: [
                    {
                        model: Imagen,
                        as: 'imagenes'
                    },
                    Usuario,
                    {
                        model: Etiqueta,
                        as: 'etiquetas'
                    }
                ]
            }
        );

        console.log(
            publicacion.toJSON()
        );
        if (!publicacion) {
            return res.send("Publicación no encontrada");
        }
        res.render('publicacion', {
            publicacion
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Error");
    }

});

module.exports = router;