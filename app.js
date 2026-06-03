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

// SESSION CON SEQUELIZE (PRIMERO LA SESIÓN)
app.use(session({
  secret: process.env.SESSION_SECRET || 'miSecretoPorDefecto',
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 15 * 60 * 1000,
    expiration: 24 * 60 * 60 * 1000,
    tableName: 'Sessions'
  })
}));

// FLASH 
app.use(flash());

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
      res.locals.usuario = usuario;
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  }
  next();
});

// MIDDLEWARE PARA MENSAJES FLASH 
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  res.locals.user = req.session.id_usuario || null;
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