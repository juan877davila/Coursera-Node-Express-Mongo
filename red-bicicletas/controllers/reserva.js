var Reserva = require('../models/reserva');
var Usuario = require('../models/usuario');
var Bicicleta = require('../models/bicicleta');

exports.reserva_list = function(req, res){
    Reserva.allReservas(function (err, reservas) {            
        res.render("reservas/index", {
            reservas: reservas
        });
     });
}

exports.reserva_create_get = function(req, res){    
    Usuario.allUsers(function (err, users) {        
        Bicicleta.allBicis(function (err, bicis) {    
            res.render('reservas/create',{usuarios: users, bicicletas: bicis});
        });
    });
}

exports.reserva_create_post = function(req, res){
    var reserva = new Reserva({
        desde: req.body.desde,
        hasta: req.body.hasta,
        bicicleta: req.body.biciId,
        usuario: req.body.userId
    });

    Reserva.add(reserva, function (err, newReserva) {
        if(err) console.error(err);
        res.redirect("/reservas");
    });
}

//Pendiente mostrar datos
exports.reserva_update_get = function(req, res){
    Usuario.allUsers(function (err, users) {        
        Bicicleta.allBicis(function (err, bicis) {  
            Reserva.findById(req.params.id, function(err, reserva){
                res.render('reservas/update', {usuarios: users, bicicletas: bicis, reserva: reserva});
            });
        });
    });
    
}

exports.reserva_update_post = function(req, res){
    Reserva.findById(req.params.id, function(err, reserva){
        reserva.desde = req.body.desde;
        reserva.hasta = req.body.hasta;
        reserva.usuario = req.body.userId;
        reserva.bicicleta = req.body.biciId;

        reserva.save(function(err) {
            if (err) return console.error(err);
            res.redirect("/reservas");
        });
    });
}

exports.reserva_detail_get = function(req, res){
    Reserva.findById(req.params.id, function(err, reserva){
        res.render('reservas/detail',{reserva});
    });
}

exports.reserva_delete_post = function(req, res){
    Reserva.removeById(req.body.id, function(err, removedReserva){
        if(err)console.error(err);
        res.redirect('/reservas');
    });
}