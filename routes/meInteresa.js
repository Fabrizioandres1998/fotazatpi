const express = require('express');
const router = express.Router();
const { me_interesa, Publicacion, notificacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// funcion para crear notificacion (ahora con id_publicacion)
async function crearNotificacion(id_usuario_destino, id_usuario_origen, id_publicacion, mensaje) {
    try {
        await notificacion.create({
            id_usuario_destino,
            id_usuario_origen,
            id_publicacion,
            mensaje,
            leida: false
        });
    } catch (error) {
        console.error('Error al crear notificación:', error);
    }
}

// marcar o quitar me interesa
router.post('/publicacion/:id', authMiddleware, async (req, res) => {
    try {
        const id_publicacion = req.params.id;
        const id_usuario = req.session.id_usuario;

        // publicacion existe
        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.redirect('back');
        }

        // verificar si marco interes
        const existe = await me_interesa.findOne({
            where: { id_usuario, id_publicacion }
        });

        if (existe) {
            // quitar interes
            await existe.destroy();
        } else {
            // marcar interes
            await me_interesa.create({ id_usuario, id_publicacion });

            // Crear notificacion para el dueño de la publicacion
            if (publicacion.id_usuario !== id_usuario) {
                await crearNotificacion(
                    publicacion.id_usuario,
                    id_usuario,
                    id_publicacion,  // ← PASAR EL ID DE LA PUBLICACIÓN
                    `quiere adquirir tu publicación "${publicacion.titulo.substring(0, 50)}"`
                );
            }
        }

        res.redirect('back');

    } catch (error) {
        console.error('Error al procesar interés:', error);
        res.redirect('back');
    }
});

// cantidad de interesados 
router.get('/publicacion/:id/count', async (req, res) => {
    try {
        const cantidad = await me_interesa.count({
            where: { id_publicacion: req.params.id }
        });
        res.json({ cantidad });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al contar intereses' });
    }
});

module.exports = router;