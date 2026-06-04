let express = require('express');
let router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// mostrar formulario de registro
router.get('/', (req, res, next) => {
    res.render('registro', { title: 'Registrarse' });
});

// procesar el registro de un nuevo usuario
router.post('/', async (req, res, next) => {
    try {
        const { username, email, password_hash, confirmPassword } = req.body;

        // validar que todos los campos esten presentes
        if (!username || !email || !password_hash || !confirmPassword) {
            return res.render('registro', {
                title: 'Registrarse',
                error: 'por favor complete todos los campos'
            });
        }

        // verifico que las contrasenas coincidan
        if (password_hash !== confirmPassword) {
            return res.render('registro', {
                title: 'Registrarse',
                error: 'las contrasenas no coinciden'
            });
        }

        // validar que la contrasena tenga al menos 6 caracteres
        if (password_hash.length < 6) {
            return res.render('registro', {
                title: 'Registrarse',
                error: 'la contrasena debe tener al menos 6 caracteres'
            });
        }

        // verificar si el email ya existe
        const emailExistente = await Usuario.findOne({ where: { email } });
        if (emailExistente) {
            return res.render('registro', {
                title: 'Registrarse',
                error: 'este email ya esta registrado'
            });
        }

        // verificar si el username ya existe
        const usernameExistente = await Usuario.findOne({ where: { username } });
        if (usernameExistente) {
            return res.render('registro', {
                title: 'Registrarse',
                error: 'este nombre de usuario ya esta en uso'
            });
        }

        // encripto la contrasena
        const passwordHash = await bcrypt.hash(password_hash, 10);

        // creo el usuario en la base de datos con todos los campos
        const nuevoUsuario = await Usuario.create({
            username: username,
            email: email,
            password_hash: passwordHash,
            activo: true,
            rol: 'usuario',
            publicaciones_eliminadas: 0
        });

        // guardar en sesion para login automatico despues del registro
        req.session.id_usuario = nuevoUsuario.id;
        req.session.rol = nuevoUsuario.rol;
        req.session.username = nuevoUsuario.username;

        // guardar la sesion explicitamente
        req.session.save((err) => {
            if (err) {
                return res.redirect('/login');
            }
            return res.redirect('/');
        });

    } catch (error) {
        console.error('error al crear usuario:', error);
        res.render('registro', {
            title: 'Registrarse',
            error: 'error al crear la cuenta. intente nuevamente.'
        });
    }
});

module.exports = router;