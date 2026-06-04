let express = require('express');
let router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// mostrar formulario de registro
router.get('/', (req, res, next) => {
    console.log('=== GET /registro ===');
    res.render('registro', { title: 'Registrarse' });
});

// procesar el registro de un nuevo usuario
router.post('/', async (req, res, next) => {
    console.log('\n=== INICIO POST /registro ===');
    console.log('Email recibido:', req.body.email);
    console.log('Username recibido:', req.body.username);
    
    try {
        const { username, email, password_hash, confirmPassword } = req.body;

        // Validar que todos los campos estén presentes
        if (!username || !email || !password_hash || !confirmPassword) {
            console.log('❌ Faltan campos requeridos');
            return res.render('registro', {
                title: 'Registrarse',
                error: 'Por favor complete todos los campos'
            });
        }

        // verifico que las contraseñas coincidan
        if (password_hash !== confirmPassword) {
            console.log('❌ Las contraseñas no coinciden');
            return res.render('registro', {
                title: 'Registrarse',
                error: 'Las contraseñas no coinciden'
            });
        }

        // Validar que la contraseña tenga al menos 6 caracteres
        if (password_hash.length < 6) {
            console.log('❌ Contraseña muy corta');
            return res.render('registro', {
                title: 'Registrarse',
                error: 'La contraseña debe tener al menos 6 caracteres'
            });
        }

        // Verificar si el email ya existe
        const emailExistente = await Usuario.findOne({ where: { email } });
        if (emailExistente) {
            console.log('❌ Email ya registrado');
            return res.render('registro', {
                title: 'Registrarse',
                error: 'Este email ya está registrado'
            });
        }

        // Verificar si el username ya existe
        const usernameExistente = await Usuario.findOne({ where: { username } });
        if (usernameExistente) {
            console.log('❌ Username ya existe');
            return res.render('registro', {
                title: 'Registrarse',
                error: 'Este nombre de usuario ya está en uso'
            });
        }

        // encripto la contraseña
        const passwordHash = await bcrypt.hash(password_hash, 10);
        console.log('✅ Contraseña hasheada correctamente');

        // creo el usuario en la base de datos con todos los campos
        const nuevoUsuario = await Usuario.create({
            username: username,
            email: email,
            password_hash: passwordHash,
            activo: true,           // Usuario activo por defecto
            rol: 'usuario',         // Rol por defecto
            publicaciones_eliminadas: 0
        });

        console.log('✅ Usuario creado exitosamente:', {
            id: nuevoUsuario.id,
            username: nuevoUsuario.username,
            email: nuevoUsuario.email,
            activo: nuevoUsuario.activo,
            rol: nuevoUsuario.rol
        });

        // Guardar en sesión para login automático después del registro
        req.session.id_usuario = nuevoUsuario.id;
        req.session.rol = nuevoUsuario.rol;
        req.session.username = nuevoUsuario.username;
        
        console.log('Guardando datos en sesión para login automático...');
        
        // Guardar la sesión explícitamente
        req.session.save((err) => {
            if (err) {
                console.error('❌ Error guardando sesión:', err);
                // Si hay error, redirigir al login manual
                req.flash('success', 'Cuenta creada exitosamente. Por favor inicia sesión.');
                return res.redirect('/login');
            }
            
            console.log('✅ Sesión guardada - Usuario autenticado automáticamente');
            req.flash('success', `¡Bienvenido ${nuevoUsuario.username}! Tu cuenta ha sido creada exitosamente.`);
            return res.redirect('/');
        });

    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        console.error('Mensaje:', error.message);
        
        // Mostrar error específico si es de validación de Sequelize
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message).join(', ');
            return res.render('registro', {
                title: 'Registrarse',
                error: `Error de validación: ${messages}`
            });
        }
        
        res.render('registro', {
            title: 'Registrarse',
            error: 'Error al crear la cuenta. Intente nuevamente.'
        });
    }
});

module.exports = router;