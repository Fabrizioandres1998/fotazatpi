let express = require('express');
let router = express.Router();
const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// mostrar formulario de login
router.get('/', (req, res, next) => {
  res.render('login', { title: 'Iniciar sesion' });
});

// procesar el login 
router.post('/', async (req, res) => {
  try {
    const { email, password_hash } = req.body;

    // Validar campos requeridos
    if (!email || !password_hash) {
      return res.status(400).json({ error: 'Completa todos los campos' });
    }

    // Buscar usuario por email
    const usuario = await Usuario.findOne({
      where: { email }
    });

    // Verificar si existe
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password_hash, usuario.password_hash);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // verificar si esta activo
    const isActivo = usuario.activo === null ? true : usuario.activo;
    if (!isActivo) {
      return res.status(401).json({ error: 'Cuenta desactivada. Contacta al administrador' });
    }

    // establecer rol por defecto
    const userRole = usuario.rol === null ? 'usuario' : usuario.rol;

    // Guardar en sesion
    req.session.id_usuario = usuario.id;
    req.session.rol = userRole;
    req.session.username = usuario.username;

    // guardar la sesion y responder
    req.session.save((err) => {
      if (err) {
        console.error('Error al guardar sesion:', err);
        return res.status(500).json({ error: 'Error al iniciar sesión' });
      }
      
      // responder json
      return res.json({ 
        success: true, 
        redirect: '/',
        message: 'Inicio de sesión exitoso'
      });
    });

  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;