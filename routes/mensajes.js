const express = require('express');
const router = express.Router();
const { mensaje, Publicacion, Usuario, notificacion } = require('../models');
const authMiddleware = require('../middlewares/authMiddleware');

// funcion para crear notificacion
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

// formulario para enviar mensaje desde notificacin
router.get('/nuevo/:id_destinatario', authMiddleware, async (req, res) => {
    try {
        const id_destinatario = req.params.id_destinatario;
        const { publicacion } = req.query;

        const destinatario = await Usuario.findByPk(id_destinatario, {
            attributes: ['id', 'username']
        });

        const publicacionData = publicacion ? await Publicacion.findByPk(publicacion) : null;

        res.render('enviarMensaje', {
            id_destinatario,
            destinatario,
            publicacion: publicacionData
        });
    } catch (error) {
        console.error(error);
        res.redirect('back');
    }
});

// Enviar mensaje
router.post('/enviar/:id_destinatario', authMiddleware, async (req, res) => {
    try {
        const id_remitente = req.session.id_usuario;
        const id_destinatario = req.params.id_destinatario;
        const { id_publicacion, mensaje: texto } = req.body;

        if (!texto || texto.trim() === '') {
            return res.redirect('back');
        }

        await mensaje.create({
            id_remitente,
            id_destinatario,
            id_publicacion: id_publicacion || null,
            mensaje: texto.trim()
        });

        // ccrear notificacion para el destinatario
        const remitente = await Usuario.findByPk(id_remitente);
        await crearNotificacion(
            id_destinatario,
            id_remitente,
            `${remitente.username} te envió un mensaje`
        );

        res.redirect('back');
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.redirect('back');
    }
});

// ver conversacion con un usuario desde notificación
router.get('/ver/:id_usuario', authMiddleware, async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const id_usuario_actual = req.session.id_usuario;
        const id_otro_usuario = req.params.id_usuario;

        const otroUsuario = await Usuario.findByPk(id_otro_usuario, {
            attributes: ['id', 'username']
        });

        const mensajes = await mensaje.findAll({
            where: {
                [Op.or]: [
                    { id_remitente: id_usuario_actual, id_destinatario: id_otro_usuario },
                    { id_remitente: id_otro_usuario, id_destinatario: id_usuario_actual }
                ]
            },
            include: [
                { model: Usuario, as: 'remitente', attributes: ['id', 'username'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        res.render('conversacion', { mensajes, otroUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar conversación: ' + error.message);
    }
});
module.exports = router;