const express = require('express');
const router = express.Router();
const { Usuario, Publicacion, Imagen, Etiqueta } = require('../models')

// mostrar formulario para crear publicacion
router.get('/crear', async (req, res, next) => {
    res.render('crearPublicacion')
})

// procesar la creacion de una nueva publicacion
router.post('/crear', async (req, res, next) => {
    try {
        // datos que vienen del formulario
        const { titulo, descripcion, url, licencia, marca_agua, etiquetas } = req.body;

        // crear la publicacion con el usuario logueado
        const publicacion = await Publicacion.create({
            titulo: titulo,
            descripcion: descripcion,
            id_usuario: req.session.id_usuario
        });

        // si me mandaron etiquetas, las proceso una por una
        if (etiquetas && etiquetas.trim()) {
            // separo por comas, limpio espacios, paso a minusculas, saco vacias
            const etiquetas_array = etiquetas
                .split(',')
                .map(e => e.trim().toLowerCase())
                .filter(e => e !== '');

            // recorro cada etiqueta
            for (const nombreEtiqueta of etiquetas_array) {
                // busco si ya existe, si no la creo
                const [etiqueta, creada] = await Etiqueta.findOrCreate({
                    where: { nombre: nombreEtiqueta }
                });

                // la asocio a la publicacion
                await publicacion.addEtiqueta(etiqueta);
            }
        }

        // si tengo url y licencia, creo la imagen
        if (url && licencia) {
            const imagenData = {
                url: url,
                licencia: licencia,
                id_publicacion: publicacion.id
            };

            // si tambien viene marca de agua, la agrego
            if (marca_agua) {
                imagenData.marca_agua = marca_agua;
            }

            await Imagen.create(imagenData);
        }

        // todo ok, voy a ver la publicacion recien creada
        res.redirect(`/publicaciones/${publicacion.id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})

module.exports = router;