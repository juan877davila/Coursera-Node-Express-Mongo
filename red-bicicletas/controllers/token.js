var Usuario = require('./../models/Usuario');
var Token = require('./../models/Token');

module.exports = {
    confirmationGet: function(req, res, next) {
        Token.findOne({ token: req.params.token }, function(err, token) {
            if (!token) {
                res.status(400).send({ type: 'not-verified', msg: 'No encontramos un usuarios con este token. Quiza haya expirado y debas solicitar uno nuevo'});
                return;
            }

            Usuario.findById(token._userId, function(err, usuario) {
                if (!usuario) {
                    res.status(400).send({ msg: 'No encontramos un usuario con este token'});
                    return;
                }

                if (usuario.verificado) return res.redirect('/users');

                usuario.verificado = true;
                usuario.save(function(err) {
                    if (err) return res.status(500).send({ msg: err.message });

                    res.redirect('/');
                });
            });
        });
    }
};