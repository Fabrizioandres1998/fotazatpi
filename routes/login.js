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

    // busco el usuario por email
    console.log('Buscando usuario con email:', email);
    const usuario = await Usuario.findOne({
      where: { email }
    })

    if (!usuario) {
      console.log('❌ Usuario NO encontrado');
      return res.send('Usuario no encontrado');
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
      return res.send('Contraseña incorrecta');
    }
    
    if (!usuario.activo) {
      console.log('❌ Usuario inactivo');
      req.flash('error', 'Tu cuenta ha sido desactivada por acumular reportes');
      return res.redirect('/login');
    }
    
    // guardo los datos en sesion
    console.log('Guardando datos en sesión...');
    console.log('ID usuario a guardar:', usuario.id);
    console.log('Rol a guardar:', usuario.rol);
    console.log('Username a guardar:', usuario.username);
    
    req.session.id_usuario = usuario.id;
    req.session.rol = usuario.rol;
    req.session.username = usuario.username;
    
    console.log('Sesión antes de guardar:', req.session);
    
    // Guardar explícitamente la sesión
    req.session.save((err) => {
      if (err) {
        console.error('❌ Error guardando la sesión:', err);
        return res.status(500).send('Error al guardar la sesión');
      }
      
      console.log('✅ Sesión guardada exitosamente');
      console.log('ID de sesión:', req.session.id);
      console.log('Contenido de la sesión después de guardar:', {
        id_usuario: req.session.id_usuario,
        rol: req.session.rol,
        username: req.session.username
      });
      
      console.log('🔄 Redirigiendo a / (página principal)');
      return res.redirect('/');
    });

  } catch (error) {
    console.error('❌ ERROR en el proceso de login:', error);
    console.error('Mensaje de error:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).send('Error interno');
  }
});

module.exports = router;