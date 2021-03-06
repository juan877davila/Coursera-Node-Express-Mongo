const Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list= function(req,res){
    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    });
}

exports.bicicleta_create = function(req,res){
    var bici = new Bicicleta({code: req.body.id, color: req.body.color, modelo: req.body.modelo});
    console.log(bici);
    bici.ubicacion = [req.body.lat, req.body.lng];
    
    Bicicleta.add(bici);

    res.status(200).json({
        bicicleta: bici
    });
}

exports.bicicleta_update = function(req, res){
    var bici = Bicicleta.findById(req.body.id);
    if (bici) {
        bici.color = req.body.color;
        bici.modelo = req.body.modelo;
        bici.ubicacion = [req.body.lat, req.body.lng];

        Bicicleta.updateById(bici);

        res.status(200).json({
            bicicleta: bici
        });
    } else {
        res.status(404).send();
    }
}

exports.bicicleta_delete = function(req, res){
    Bicicleta.removeById(req.body.id);

    res.status(204).send();
}
/*
exports.bicicleta_create=function(req,res){
    var bici= new Bicicleta(req.body.id,req.body.color,req.body.modelo);
    bici.ubicacion=[req.body.lat,req.body.long];
    Bicicleta.add(bici);
    res.status(200).json({
        bicicleta: bici
    })  
}

exports.bicicleta_update = function(req, res) {
    var bici = Bicicleta.findById(req.params.id);

    if (bici) {
        bici.color = req.body.color;
        bici.modelo = req.body.modelo;
        bici.ubicacion = [req.body.lat, req.body.lng];

        Bicicleta.updateById(bici);

        res.status(200).json({
            bicicleta: bici
        });
    } else {
        res.status(404).send();
    }
}

exports.bicicleta_delete=function(req,res){
    Bicicleta.removeById(req.body.id);
    res.status(204).send();
}
*/