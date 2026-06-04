let express = require('express');
let router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// mostrar formulario de login
router.get('/', (req, res, next) => {
  console.log('=== GET /login ===');
  console.log('Sesión actual:', req.session);
  res.render('login', { title: 'Iniciar sesion' });
});

// procesar el login
router.post('/', async (req, res) => {
  console.log('\n=== INICIO POST /login ===');
  console.log('Email recibido:', req.body.email);
  console.log('Password recibida (length):', req.body.password_hash?.length);

  try {
    const { email, password_hash } = req.body;

    // Validar que los campos no estén vacíos
    if (!email || !password_hash) {
      console.log('❌ Email o contraseña vacíos');
      req.flash('error', 'Por favor complete todos los campos');
      return res.redirect('/login');
    }

    // busco el usuario por email
    console.log('Buscando usuario con email:', email);
    const usuario = await Usuario.findOne({
      where: { email }
    })

    if (!usuario) {
      console.log('❌ Usuario NO encontrado');
      req.flash('error', 'Usuario no encontrado');
      return res.redirect('/login');
    }

    console.log('✅ Usuario encontrado:', usuario.email);
    console.log('Usuario activo:', usuario.activo);
    console.log('Rol del usuario:', usuario.rol);

    // verifico la contraseña
    console.log('Verificando contraseña...');
    const passwordValida = await bcrypt.compare(password_hash, usuario.password_hash);
    console.log('Contraseña válida:', passwordValida);

    if (!passwordValida) {
      console.log('❌ Contraseña incorrecta');
      req.flash('error', 'Contraseña incorrecta');
      return res.redirect('/login');
    }

    // CORREGIDO: Manejar el caso donde activo es null
    // Si activo es null, lo consideramos como true (usuario activo por defecto)
    const isActivo = usuario.activo === null ? true : usuario.activo;

    if (!isActivo) {
      console.log('❌ Usuario inactivo');
      req.flash('error', 'Tu cuenta ha sido desactivada por acumular reportes');
      return res.redirect('/login');
    }

    // CORREGIDO: Manejar el caso donde rol es null
    const userRole = usuario.rol === null ? 'usuario' : usuario.rol;

    // guardo los datos en sesion
    console.log('Guardando datos en sesión...');
    console.log('ID usuario a guardar:', usuario.id);
    console.log('Rol a guardar:', userRole);
    console.log('Username a guardar:', usuario.username);

    req.session.id_usuario = usuario.id;
    req.session.rol = userRole;
    req.session.username = usuario.username;

    console.log('Sesión antes de guardar:', req.session);

    // Guardar explícitamente la sesión
    req.session.save((err) => {
      if (err) {
        console.error('❌ Error guardando la sesión:', err);
        req.flash('error', 'Error al iniciar sesión. Intente nuevamente.');
        return res.redirect('/login');
      }

      console.log('✅ Sesión guardada exitosamente');
      console.log('ID de sesión:', req.session.id);
      console.log('Contenido de la sesión después de guardar:', {
        id_usuario: req.session.id_usuario,
        rol: req.session.rol,
        username: req.session.username
      });

      console.log('🔄 Redirigiendo a / (página principal)');
      req.flash('success', `¡Bienvenido ${usuario.username}!`);
      return res.redirect('/');
    });

  } catch (error) {
    console.error('❌ ERROR en el proceso de login:', error);
    console.error('Mensaje de error:', error.message);
    console.error('Stack trace:', error.stack);
    req.flash('error', 'Error interno del servidor. Intente más tarde.');
    return res.redirect('/login');
  }
});

module.exports = router;