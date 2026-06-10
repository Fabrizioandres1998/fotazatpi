const express = require('express');
const router = express.Router();
const { me_interesa, Publicacion, notificacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// funcion para crear notificacion 
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

        const publicacion = await Publicacion.findByPk(id_publicacion);
        if (!publicacion) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }

        const existe = await me_interesa.findOne({
            where: { id_usuario, id_publicacion }
        });

        let accion;
        if (existe) {
            await existe.destroy();
            accion = 'quitado';
        } else {
            await me_interesa.create({ id_usuario, id_publicacion });
            accion = 'agregado';
            
            if (publicacion.id_usuario !== id_usuario) {
                await crearNotificacion(
                    publicacion.id_usuario,
                    id_usuario,
                    id_publicacion,
                    `quiere adquirir tu publicación "${publicacion.titulo.substring(0, 50)}"`
                );
            }
        }

        // Obtener nuevo contador
        const cantidad = await me_interesa.count({
            where: { id_publicacion }
        });

        res.json({
            success: true,
            accion: accion,
            cantidad: cantidad,
            yaInteresado: accion === 'agregado'
        });

    } catch (error) {
        console.error('Error al procesar interés:', error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
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