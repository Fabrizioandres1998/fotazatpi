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
        const { titulo, descripcion, url, url1, url2, licencia, marca_agua, etiquetas } = req.body;

        // crear la publicacion
        const publicacion = await Publicacion.create({
            titulo: titulo,
            descripcion: descripcion,
            id_usuario: req.session.id_usuario
        });

        // procesar etiquetas (igual)
        if (etiquetas && etiquetas.trim()) {
            const etiquetas_array = etiquetas
                .split(',')
                .map(e => e.trim().toLowerCase())
                .filter(e => e !== '');

            for (const nombreEtiqueta of etiquetas_array) {
                const [etiqueta, creada] = await Etiqueta.findOrCreate({
                    where: { nombre: nombreEtiqueta }
                });
                await publicacion.addEtiqueta(etiqueta);
            }
        }

        // crear imagenes (si tienen URL y licencia)
        const urls = [url, url1, url2].filter(u => u && u.trim() !== '');

        for (const imagenUrl of urls) {
            const imagenData = {
                url: imagenUrl,
                licencia: licencia,
                id_publicacion: publicacion.id
            };

            if (marca_agua) {
                imagenData.marca_agua = marca_agua;
            }

            await Imagen.create(imagenData);
        }

        res.redirect(`/publicaciones/${publicacion.id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
})

module.exports = router;