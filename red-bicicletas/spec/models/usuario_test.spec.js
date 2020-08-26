var mongoose = require('mongoose');
var Bicicleta = require('../../models/bicicleta');
var Usuario = require('../../models/usuario');
var Reserva = require('../../models/reserva');

describe('Testing Usuarios',function(){
    beforeEach(function(done) {
        var mongoDB = 'mongodb://coursera:coursera2020@cluster0-shard-00-00.la9b4.mongodb.net:27017,cluster0-shard-00-01.la9b4.mongodb.net:27017,cluster0-shard-00-02.la9b4.mongodb.net:27017/red_bicicletas?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'; 
        mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
        const db = mongoose.connection;
        db.on('error',console.error.bind(console, 'connection error'));
        db.once('open', function() {
           console.log('we are connected to test database');
           done(); 
        });      
    });
    afterEach(function(done) {     
        Reserva.deleteMany({}, function(err, success){
            if(err) console.log(err);
            Usuario.deleteMany({}, function(err, success){
                if(err) console.log(err);
                Bicicleta.deleteMany({}, function(err, success){
                    if(err) console.log(err);
                    done();
                });
            });
        });
    });
  
    describe('Cuando un usuario reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({nombre: 'Nestor'});
            usuario.save();
            const bicicleta = new Bicicleta({code: 1, color: "verder", modelo: "urbana" });
            bicicleta.save();          
            var hoy = new Date();
            var manana = new Date();
            manana.setDate(hoy.getDate()+1);      
            usuario.reservar(bicicleta.id, hoy, manana, function(err, reserva){
                Reserva.find({}).populate('bicicleta').populate('usuario').exec(function(err, reservas){
                    console.log(reservas[0].usuario.nombre);
                    console.log(reservas[0].diasDeReserva());
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                    done();
                });
            });
        });
    });
});