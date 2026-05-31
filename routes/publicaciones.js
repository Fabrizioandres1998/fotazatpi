const express = require('express');
const router = express.Router();
const { Publicacion, Imagen, Usuario, Etiqueta } = require('../models');

// listar todas o filtrar por etiqueta
router.get('/', async (req, res) => {
    const { etiqueta } = req.query;
    let publicaciones = [];

    try {
        if (etiqueta) {
            // busco la etiqueta por nombre
            const etiquetaEncontrada = await Etiqueta.findOne({
                where: { nombre: etiqueta.toLowerCase() }
            })

            if (etiquetaEncontrada) {
                // traigo solo las publicaciones que tienen esta etiqueta
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
            // sin filtro, traigo todas
            if (!req.session.id_usuario) {
                publicaciones = await Publicacion.findAll({
                    include: [
                        { model: Usuario },
                        { model: Imagen, as: "imagenes", where: { licencia: "sin_copyright" } }
                    ]
                })
                // pasar publicaciones a la vista
                return res.render('publicaciones', {
                    publicaciones,
                    filtro: null
                });
            }
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

// ver una publicacion individual
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

// mostrar formulario de edicion
router.get('/:id/editar', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id, {
            include: [
                { model: Imagen, as: 'imagenes' },
                { model: Usuario },
                { model: Etiqueta, as: 'etiquetas' }
            ]
        });

        if (!publicacion) {
            return res.status(404).send("Publicación no encontrada");
        }

        // verifico que sea el dueño
        if (publicacion.id_usuario !== req.session.id_usuario) {
            return res.status(403).send("No autorizado");
        }

        const todasEtiquetas = await Etiqueta.findAll();

        res.render('editarPublicacion', {
            publicacion,
            todasEtiquetas
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el formulario de edición");
    }
});

// procesar la actualizacion
router.post('/:id/actualizar', async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id);

        if (!publicacion) {
            return res.status(404).send("Publicación no encontrada");
        }

        // actualizo titulo y descripcion
        await publicacion.update({
            titulo: req.body.titulo,
            descripcion: req.body.descripcion
        });

        // actualizo las etiquetas
        if (req.body.etiquetas) {
            let etiquetasIds = req.body.etiquetas;

            if (!Array.isArray(etiquetasIds)) {
                etiquetasIds = [etiquetasIds];
            }

            await publicacion.setEtiquetas(etiquetasIds);
        } else {
            // si no mandaron nada, limpio todo
            await publicacion.setEtiquetas([]);
        }

        res.redirect(`/publicaciones/${publicacion.id}`);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar");
    }
});

// eliminar una publicacion
router.post('/:id/eliminar', async (req, res) => {
    try {
        // busco la publicacion por id
        const publicacion = await Publicacion.findByPk(req.params.id);

        if (!publicacion) {
            return res.status(404).send("Publicación no encontrada");
        }

        // verifico que sea el dueño
        if (publicacion.id_usuario !== req.session.id_usuario) {
            return res.status(403).send("No autorizado");
        }

        // elimino la publicacion (las imagenes se eliminan solas si tenes CASCADE)
        await publicacion.destroy();

        res.redirect('/perfil');

    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar la publicacion");
    }
});

module.exports = router;