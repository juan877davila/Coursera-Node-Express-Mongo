const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Usuario = require('./../models/Usuario');

passport.use(new LocalStrategy(
    function(email, password, done) {
        Usuario.findOne({ email: email }, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, { message: 'E-mail no existe o incorrecto'});
            if (!user.validPassword(password)) return done(null, false, { message: 'Password incorrecto'});
            
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    Usuario.findById(id, function(err, usuario) {
        cb(err, usuario);
    });
});

module.exports = passport;