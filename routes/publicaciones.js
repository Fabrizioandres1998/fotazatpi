const express = require('express');
const router = express.Router();
const { Publicacion, Imagen, Usuario } = require('../models');

router.get('/', async (req, res, next) => {
    try {
        const publicaciones = await Publicacion.findAll({
            include: [
                {
                    model: Imagen,
                    as: "imagenes"
                },
                Usuario
            ]
        })
        res.render('publicaciones', {
            publicaciones
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Error al obtener publicaciones' });
    }
})

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
                    Usuario
                ]
            }
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