var mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');
const request = require('request');
const server = require('../../bin/www');


var base_url = "http://localhost:3000/api/bicicletas";

describe ('Bicicletas API', () => {
    beforeEach(function(done) {
        var mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});

        const db = mongoose.connection;

        db.on('error', console.error.bind(console, 'conection error'));
        db.once('open', function() {
            console.log('we are connected to test database');
            done();
        });

    });
    
    afterEach(function(done) {
        Bicicleta.deleteMany({}, function(err, success){
            if (err) console.log(err);
            done();
        });
    });


    describe('GET BICICLETAS /',() => {
        it('Status 200',(done) => {           
           request.get(base_url, function(error, response, body){
               var result = JSON.parse(body);
               //console.log('salida result: '+ result);
               expect(response.statusCode).toBe(200);
               //console.log('salida resultado: ' + result);
               expect(result.bicicletas).toBeUndefined();
               done();
            });
        });
    });

    describe('POST BICICLETAS /create',() => {
        it('Status 200',(done) => {
            var headers = {'content-type' : 'application/json'};
            var aBici = '{"id" : 10, "color" : "rojo", "modelo":"urbana", "lat" :-34, "lng" :-54 }';
            request.post({
                headers : headers,
                url : base_url + '/create',
                body : aBici
            }, function(error, response, body){
                expect(response.statusCode).toBe(200);
                var bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe("rojo");
                expect(bici.ubicacion[0]).toBe(-34);
                expect(bici.ubicacion[1]).toBe(-54);
                done();
            });

        });
    });
});

/*
describe('Bicicleta API',()=>{
    describe('GET BICICLETAS /',()=>{
        it('Status 200',()=>{
            expect(Bicicleta.allBicis.length).toBe(0);
            const a = new Bicicleta(1,'negro','urbana',[-34.6012424,-58.3861497]);
            Bicicleta.add(a);
            request.get('http://localhost:5000/api/bicicletas', function(error,response,body){
                expect(response.statusCode).toBe(200);
            });
        });
    })
    
    describe('POST BICICLETAS /create',()=>{
        it('Status 200',(done)=>{
            let headers = {'content-type':'application/json'};
            let aBici = '{"id":10,"color":"rojo","modelo":"urbana","lat":-34,"long":-54}';
            request.post({
                headers: headers,
                url: 'http://localhost:5000/api/bicicletas/create',
                body: aBici
                }, function(error,response,body){
                    expect(response.statusCode).toBe(200);
                    expect(Bicicleta.findById(10).color).toBe("rojo");
                    done();
            }); 
        });
    });
});
*/
