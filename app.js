var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');

// IMPORTACION DE MODELOS Y SEQUELIZE
const { Usuario, sequelize } = require('./models');

// IMPORTACION RUTAS
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registroRouter = require('./routes/registro');
const perfilRouter = require('./routes/perfil');
const crearPublicacionRouter = require('./routes/crearPublicacion');
const publicacionesRouter = require('./routes/publicaciones');
const followerRouter = require('./routes/follower');
const valoracionRouter = require('./routes/valoracion');
const reportePublicacionRouter = require('./routes/reportePublicacion');
const moderadorRouter = require('./routes/moderador');

// IMPORTACION MIDDLEWARES PROPIOS
const authMiddleware = require('./middlewares/authMiddleware');
const noAuthMiddleware = require('./middlewares/noAuthMiddleware');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// MIDDLEWARES DE EXPRESS
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ========== CONFIGURACIÓN DE SESIÓN MEJORADA ==========
// Crear el store de sesión
const sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // 15 minutos
  expiration: 24 * 60 * 60 * 1000, // 24 horas
  tableName: 'Sessions'
});

// Sincronizar el store al iniciar
sessionStore.sync();

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'miSecretoPorDefecto',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // IMPORTANTE: solo HTTPS en producción
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    sameSite: 'lax' // Mejora la seguridad
  },
  name: 'sessionId' // Nombre personalizado para la cookie
}));

// ========== MIDDLEWARE DE DEBUG DE SESIÓN (agregar esto) ==========
app.use((req, res, next) => {
  console.log('\n=== 🔍 DEBUG SESIÓN ===');
  console.log('📌 Ruta:', req.method, req.originalUrl);
  console.log('🍪 Cookie recibida:', req.headers.cookie);
  console.log('🆔 Session ID:', req.session?.id);
  console.log('📦 Datos en sesión:', {
    id_usuario: req.session?.id_usuario,
    rol: req.session?.rol,
    username: req.session?.username
  });
  console.log('⏰ Expira:', req.session?.cookie?.expires);
  console.log('=====================\n');
  next();
});

// FLASH 
app.use(flash());

// ========== MIDDLEWARE PARA PASAR SESSION A LAS VISTAS ==========
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});

// ========== MIDDLEWARE PARA CARGAR USUARIO EN LAS VISTAS ==========
app.use(async (req, res, next) => {
  if (req.session.id_usuario) {
    try {
      const usuario = await Usuario.findByPk(req.session.id_usuario);
      if (usuario) {
        res.locals.usuario = usuario;
        res.locals.userId = usuario.id;
        console.log('✅ Usuario cargado en vistas:', usuario.username);
      } else {
        console.warn('⚠️ Usuario no encontrado en BD, limpiando sesión');
        req.session.destroy();
      }
    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
    }
  } else {
    console.log('⚠️ No hay usuario en sesión');
  }
  next();
});

// ========== MIDDLEWARE PARA MENSAJES FLASH MEJORADO ==========
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.user = req.session.id_usuario || null;
  next();
});

// ========== MIDDLEWARE PARA VERIFICAR SESIÓN EN CADA REQUEST ==========
app.use((req, res, next) => {
  // Guardar la sesión después de cada modificación
  const originalSave = req.session.save;
  req.session.save = function(callback) {
    console.log('💾 Guardando sesión...');
    originalSave.call(this, (err) => {
      if (err) {
        console.error('❌ Error guardando sesión:', err);
      } else {
        console.log('✅ Sesión guardada exitosamente');
      }
      if (callback) callback(err);
    });
  };
  next();
});

// ========== MIDDLEWARE DE AUTENTICACIÓN GLOBAL ==========
app.use((req, res, next) => {
  const publicPaths = ['/login', '/registro', '/', '/publicaciones'];
  const isPublicPath = publicPaths.some(path => req.path === path || req.path.startsWith('/publicaciones'));
  const isStaticFile = req.path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/);
  
  if (!isPublicPath && !isStaticFile && !req.session.id_usuario) {
    console.log('🔒 Acceso denegado a:', req.path, '- Redirigiendo a login');
    req.flash('error', 'Por favor inicia sesión para acceder a esta página');
    return res.redirect('/login');
  }
  next();
});

// USE DE LAS RUTAS
app.use('/login', noAuthMiddleware, loginRouter);
app.use('/registro', noAuthMiddleware, registroRouter);
app.use('/logout', logoutRouter);
app.use('/perfil', authMiddleware, perfilRouter);
app.use('/publicaciones', authMiddleware, crearPublicacionRouter);
app.use('/publicaciones', publicacionesRouter);
app.use('/', publicacionesRouter);
app.use('/follower', followerRouter);
app.use('/valoracion', valoracionRouter);
app.use('/reportes', reportePublicacionRouter);
app.use('/moderador', moderadorRouter);

// ========== MIDDLEWARE PARA VERIFICAR STORE DE SESIÓN ==========
app.use((req, res, next) => {
  // Verificar que la sesión se guardó correctamente después de login
  if (req.method === 'POST' && req.path === '/login') {
    const originalRedirect = res.redirect;
    res.redirect = function(url) {
      console.log('🔄 Redirigiendo a:', url);
      console.log('Estado de la sesión después de POST login:', {
        id_usuario: req.session?.id_usuario,
        rol: req.session?.rol,
        sessionId: req.session?.id
      });
      originalRedirect.call(this, url);
    };
  }
  next();
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ========== EXPORTAR APP ==========
module.exports = app;