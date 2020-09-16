var Usuario = require('./../models/Usuario');
const { NotExtended } = require('http-errors');

module.exports = {
    list: function(req, res) {
        Usuario.find({}, (err, usuarios) => {
            console.log(usuarios);
            res.render('usuarios/index', { usuarios: usuarios });
        });
    },
    update_get: function(req, res) {
        Usuario.findById(req.params.id, function(err, usuario) {
            res.render('usuarios/update', { errors: {}, usuario});
        });
    },
    update: function(req, res) {
        var update_values = { nombre: req.body.nombre };

        Usuario.findByIdAndUpdate(req.params.id, update_values, function(err, usuario) {
            if (err) {
                console.log(err);
                res.render('usuarios/update', { errors: err.errors, usuarios: new Usuario({ nombre: req.body.nombre, email: req.body.email })});
            } else {
                res.redirect('/users');
                return;
            }
        });
    },
    create_get: function(req, res) {
        res.render('usuarios/create', { errors: {}, usuario: new Usuario() });
    },
    create: function(req, res) {
        if (req.body.password != req.body.confirm_password) {
            res.render('usuarios/create', { errors: { confirm_password: { message: 'La contraseña no coinciden' }, usuarios: new Usuario({ nombre: req.body.nombre, email: req.body.email }) } });
            return;
        }

        Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password }, function(err, newUser) {
            if (err) {
                res.render('usuarios/update', { errors: err.errors, usuarios: new Usuario({ nombre: req.body.nombre, email: req.body.email })});
            } else {
                newUser.enviar_email_bienvenida();
                res.redirect('/users');
            }
        });
    },
    delete: function(req, res, next) {
        Usuario.findByIdAndDelete(req.body.id, function(err) {
            if (err) {
                next(err);
            } else {
                res.redirect('/users');
            }
        })
    }
}