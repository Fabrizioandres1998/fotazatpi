var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
const flash = require('connect-flash');

// IMPORTACION DE MODELOS Y SEQUELIZE
const { Usuario, sequelize, notificacion } = require('./models');

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
const meInteresaRouter = require('./routes/meInteresa');
const notificacionesRouter = require('./routes/notificaciones');
const mensajesRouter = require('./routes/mensajes');
const reporteComentarioRouter = require('./routes/reporteComentario');

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

// CONFIGURACION DE SESION
const sessionStore = new SequelizeStore({
  db: sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  expiration: 24 * 60 * 60 * 1000,
  tableName: 'Sessions'
});

sessionStore.sync();

app.use(session({
  secret: process.env.SESSION_SECRET || 'miSecretoPorDefecto',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  },
  name: 'sessionId',
  proxy: true
}));

// Middleware para contar notificaciones no leídas
app.use(async (req, res, next) => {
  if (req.session.id_usuario) {
    const noLeidas = await notificacion.count({
      where: { id_usuario_destino: req.session.id_usuario, leida: false }
    });
    res.locals.notificacionesNoLeidas = noLeidas;
  } else {
    res.locals.notificacionesNoLeidas = 0;
  }
  next();
});

// MIDDLEWARE PARA PASAR SESSION A LAS VISTAS
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// MIDDLEWARE PARA CARGAR USUARIO EN LAS VISTAS
app.use(async (req, res, next) => {
  if (req.session.id_usuario) {
    try {
      const usuario = await Usuario.findByPk(req.session.id_usuario);
      if (usuario) {
        res.locals.usuario = usuario;
        res.locals.userId = usuario.id;
      } else {
        req.session.destroy();
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  }
  next();
});

// MIDDLEWARE DE AUTENTICACIÓN GLOBAL
app.use((req, res, next) => {
  const publicPaths = ['/login', '/registro', '/', '/publicaciones'];
  const isPublicPath = publicPaths.some(path => req.path === path || req.path.startsWith('/publicaciones') || req.path === '/favicon.ico');
  const isStaticFile = req.path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico)$/);

  if (!isPublicPath && !isStaticFile && !req.session.id_usuario) {
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
app.use('/reportes/publicacion', reportePublicacionRouter);
app.use('/moderador', moderadorRouter);
app.use('/me-interesa', meInteresaRouter);
app.use('/notificaciones', notificacionesRouter);
app.use('/mensajes', mensajesRouter);
app.use('/reportes/comentario', reporteComentarioRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;