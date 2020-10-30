require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const Usuario = require('./models/Usuario');
var Token = require('./models/Token');
const passport = require('./config/passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bicicletasRouter = require('./routes/bicicletas');
var tokenRouter = require('./routes/token');
var authRouterApi = require('./routes/api/auth');
var bicicletasRouterApi = require('./routes/api/bicicletas');
var usuariosRouterApi = require('./routes/api/usuarios');

const store = new session.MemoryStore;

var app = express();

app.set('secretKey', 'jwt_pwd_!!223344');
app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000 },
  store: store,
  saveUninitialized: true,
  resave: true,
  secret: 'lunita2018-06'
}));

var mongoDb = 'mongodb://localhost:27017/red_bicycles';
mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.log.bind(console, 'MongoDb connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', function(req, res) {
  res.render('session/login');
});
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) return res.render('session/login', { info });

    req.login(user, function(err) {
      if (err) return next(err);

      return res.redirect('/');
    });
  })(req, res, next);
});
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
app.get('/forgotPassword', function(req, res) {
  res.render('session/forgotPassword');
});
app.get('/forgotPassword/:token', function(req, res, next) {
  Token.findOne({ token: req.params.token }, function(err, token) {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No existe el token'});

    Usuario.findById(token._userId, function(err, usuario) {
      if (!usuario) return res.status(400).send({ msg: 'No existe un usuario asociado al token'});

      res.render('session/resetPassword', { errors: {}, usuario: usuario });
    });
  });
});
app.post('/forgotPassword', function(req, res, next) {
  Usuario.findOne({ email: req.body.email }, function(err, usuario) {
    
    if (!usuario) return res.render('session/forgotPassword', { info: { message: 'No existe un usuario con este correo'}});

    usuario.resetPassword(function(err) {
      if (err) return next(err);

      console.log('session/forgotPasswordMessage');
    });

    res.render('session/forgotPasswordMessage');
  });
});
app.get('/resetPassword/:token', function(req, res, next) {
  Token.findOne({ token: req.params.token }, function(err, token) {
    if (!token) return res.status(400).send({ type: 'not-verified', msg: 'No existe un usuario asociado al token. Verifique que su token no haya expirado' });

    Usuario.findById(token._userId, function(err, usuario) {
      if (!usuario) return res.status(400).send({ msg: 'No existe un usuario asociado al token' });

      res.render('session/resetPassword', { errors: {}, usuario: usuario });
    });
  });
});
app.post('/resetPassword', function(req, res) {
  if (req.body.password != req.body.confirm_password) {
    res.render('session/resetPassword', { errors: { confirm_password: { message: 'Passoword no coincide '}}, usuario: new Usuario({ email: req.body.email }) });
    return;
  }
  Usuario.findOne({ email: req.body.email }, function(err, usuario) {
    usuario.password = req.body.password;
    usuario.save(function(err) {
      if (err) {
        res.render('session/resetPassword', { errors: err.errors, usuario: new Usuario({ email: req.body.email }) });
      } else
        res.redirect('/login');
    });
  });
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/token', tokenRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);
app.use('/api/auth', authRouterApi);
app.use('/api/bicicletas', validarUsuario, bicicletasRouterApi);
app.use('/api/usuarios', usuariosRouterApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    console.log('usuario sin autenticarse');
    res.redirect('/login');
  }
}

function validarUsuario(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) res.json({ status: 'error', message: err.message, dat: null });

    req.body.userId = decoded.id;
    console.log('jwt verifify', decoded);

    next();
  });
}

module.exports = app;
