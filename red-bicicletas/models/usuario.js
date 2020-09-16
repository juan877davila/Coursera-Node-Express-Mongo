var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

var Reserva = require('./Reserva');
var Token = require('./Token');
var mailer = require('./../mailer/mailer');

var Schema = mongoose.Schema;
const saltRounds = 10;

const validateEmail = function(email) {
    const re = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
    return re.test(email);
};

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor ingresa un correo valido'],
        match: [/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    passwordResetToke: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario' });

usuarioSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }

    next();
});

usuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

usuarioSchema.methods.reserve = function(bicyId, since, until, cb) {
    var reserva = new Reserva({ user: this._id, bicycle: bicyId, since: since, until });
    console.log(reserva);
    reserva.save(cb);
};

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({ _userId: this._id, token: crypto.randomBytes(16).toString('hex') });
    const destination = this.email;

    token.save(function(err) {
        if (err) console.log(err.message);

        const emailOptions = {
            from: 'no-reply@biclyclesnet.com',
            to: destination,
            subject: 'Verificacion de cuenta',
            text: `Hola \n\n Pro favor verificar su cuenta haciendo click en este enlace: http://localhost:3000/token/confirmation/${token.token}\n`
        };

        mailer.sendMail(emailOptions, function(err) {
            if (err) {
                console.log(err);
                return;
            }

            console.log(`A verification mail has been send to ${destination}`);
        });
    });
};

usuarioSchema.methods.resetPassword = function(cb) {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString('hex') });
    const email_destination = this.email;
    token.save(function(err) {
        if (err) return cb(err);

        const emailOptions = {
            from: 'no-reply@biclyclesnet.com',
            to: email_destination,
            subject: 'Restablecer contraseña',
            text: `Hola \n\n Pro favor verificar su cuenta haciendo click en este enlace: http://localhost:3000/resetPassword/${token.token}\n`
        };

        mailer.sendMail(emailOptions, function(err) {
            if (err) {
                console.log(err);
                return;
            }

            console.log(`Se envio un correo para restablecer contraseña a ${destination}`);
        });

        cb(null);
    });
}

module.exports = mongoose.model('User', usuarioSchema);