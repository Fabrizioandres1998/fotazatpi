const express = require('express');
const router = express.Router();
const { Valoracion, Publicacion, notificacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// Funcion para crear notificacion
async function crearNotificacion(id_usuario_destino, id_usuario_origen, mensaje) {
    try {
        await notificacion.create({
            id_usuario_destino,
            id_usuario_origen,
            mensaje,
            leida: false
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
    }
}

// votar una publicacion
router.post('/publicacion/:id', authMiddleware, async (req, res) => {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.id_usuario;
        const { puntaje } = req.body;

        // Validar puntaje
        if (!puntaje || puntaje < 1 || puntaje > 5) {
            return res.redirect('back');
        }

        // verificar que la publicacion existe
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.redirect('back');
        }

        // autor no puede votar su propia publicacion
        if (publicacion.id_usuario === id_usuario) {
            return res.redirect('back');
        }

        // buscar si ya voto
        const votoExistente = await Valoracion.findOne({
            where: { id_usuario, id_publicacion }
        });

        if (votoExistente) {
            await votoExistente.update({ puntaje });
        } else {
            await Valoracion.create({ id_usuario, id_publicacion, puntaje });

            // NOTIFICACIÓN: cuando alguien vota por primera vez
            await crearNotificacion(
                publicacion.id_usuario,
                id_usuario,
                ` valoró tu publicación con ${puntaje} estrellas`
            );
        }

        res.redirect('back');

    } catch (error) {
        console.error('Error al votar:', error);
        res.redirect('back');
    }
});

module.exports = router;