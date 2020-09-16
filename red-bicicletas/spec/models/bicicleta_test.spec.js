var mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');

describe('Testing Bicicletas',function(){
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
        Bicicleta.deleteMany({}, function(err, success){
            if(err) console.log(err);
            done();
        });
    });
    
    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de bicicleta', () => {
            var bici = Bicicleta.createInstance(1, "verde", "urbana", [45.5042441,-73.6251757]);
            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(45.5042441);
            expect(bici.ubicacion[1]).toEqual(-73.6251757);
        });
    });

    describe('Bicicleta.allBicis', () => {
        it('comienza vacia',(done) => {
            Bicicleta.allBicis(function(err, bicis){
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe ('Bicicleta.add', () => {
        it('agregar solo una bici', (done) => {
            var aBici = new Bicicleta({code:1, color: "verde", modelo: "urbana"});
            Bicicleta.add(aBici, function (err, newBicis){
                if(err) console.log(err);
                Bicicleta.allBicis(function(err, bicis){
                    expect(bicis.length).toEqual(1);
                    //console.log("SALIDA add : " + bicis.length );
                    expect(bicis[0].code).toEqual(aBici.code);
                    done();
                });                
            });
        });
    });

    describe ('Bicicleta.findByCode', () => {
        it('debe devolver la bici con code 1', (done) => {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);
                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if (err) console.log(err);
                    //console.log("SALIDA find : " + bicis.length );               
                    var aBici2 = new Bicicleta({code: 2, color: "roja", modelo: "urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if (err) console.log(err);
                        Bicicleta.findByCode(1, function(error, targetBici){
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);
                            //console.log("SALIDA test findByCode : " + bicis.length );
                            done();
                        });
                    });
                });    
            });
        });
    });

    describe ('Bicicleta.removeByCode', () => {
        it('debe borrar la bici con  code 2', (done) => {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);
                var aBici = new Bicicleta({code: 1, color: "verde", modelo: "urbana"});
                Bicicleta.add(aBici, function(err, newBici){
                    if (err) console.log(err);
                    //console.log("SALIDA remove : " + bicis.length );
                    var aBici2 = new Bicicleta({code: 2, color: "roja", modelo: "urbana"});
                    Bicicleta.add(aBici2, function(err, newBici){
                        if (err) console.log(err);
                        //expect(bicis.length).toBe(2);
                        Bicicleta.removeByCode(2, function(error, targetBici){
                            expect(bicis.length).toBe(0); 
                            done();
                        });
                    });
                });
            });
        });
    });
});

/*
beforeEach(()=>{Bicicleta.allBicis =[];});

describe('Bicicleta.allBicis',()=>{
    it('comienza vacia',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
    });
});

describe('Bicicleta.add',()=>{
    it('agregamos una',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        const a = new Bicicleta(1,'rojo','urbana',[-34.6012424,-58.3861497]);
        Bicicleta.add(a);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.finById',()=>{
    it('debe devolver la bici con id 1',()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
        const aBici = new Bicicleta(1,'verde','urbana');
        const aBici2 = new Bicicleta(2,'verde','urbana');
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);
        const targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);
    });
});
*/
