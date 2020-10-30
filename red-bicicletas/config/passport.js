const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
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

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST +"/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {        
       Usuario.findOneOrCreatedByGoogle(profile, function (err, user) {
         return done(err, user);
       });
  }
));

//Autenticación por Facebook
passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET
    }, function(accessToken, refreshToken, profile, done){
        try {
            Usuario.findOneOrCreatedByFacebook(profile, function(err, user){
                if(err) console.log( 'err: ' + err);
                return done(err, user);
            });
        } catch (err2) {
            console.log(err2);
            return done(err2, null);
        }
    }
));


module.exports = passport;