var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number],index:{type:'2dsphere',sparse:true}
    }
})

bicicletaSchema.statics.createInstance = function(code,color,modelo,ubicacion){
    return new this({
        code:code,
        color:color,
        modelo:modelo,
        unicacion:ubicacion
    });
}; 

bicicletaSchema.methods.toSring=function(){
    return 'code: '+ this.code + " | color: " + this.color;
};

bicicletaSchema.statics.allBicis = function(cb){
    return this.find({},cb);
};

bicicletaSchema.statics.add = function(aBici, cb){
    this.create(aBici, cb); //create viene de la mongoose
};

bicicletaSchema.statics.findByCode = function(aCode, cb){
    this.findOne({code: aCode}, cb); //findOne viene de la mongoose
};

bicicletaSchema.statics.removeByCode = function(aCode, cb){
    this.deleteOne({code: aCode}, cb); //deleteOne viene de la mongoose
};


module.exports = mongoose.model('Bicicleta',bicicletaSchema);

/*
const Bicicleta=function(id,color,modelo,ubicacion){
   this.id=id;
   this.color=color;
   this.modelo=modelo;
   this.ubicacion=ubicacion;
}

Bicicleta.prototype.toSring=function(){
    return 'id: '+ this.id + " | color: " + this.color;
}

Bicicleta.allBicis=[];
Bicicleta.add = function(aBici){
    Bicicleta.allBicis.push(aBici);
}

Bicicleta.findById=function(aBiciId){
    var aBici = Bicicleta.allBicis.find(x=>x.id==aBiciId);
    if (aBici)
        return aBici;
    else    
        throw new Error(`No existe el Id buscado ${aBiciId}`)    
}

Bicicleta.removeById=function(aBiciId){
    for(var i=0; i<Bicicleta.allBicis.length;i++){
        if (Bicicleta.allBicis[i].id==aBiciId){
            Bicicleta.allBicis.splice(i,1);
            break
        }
    }
}

Bicicleta.updateById = function(aBici) {
    var aBici = Bicicleta.findById(aBici.id);
    for (var i = 0; i < Bicicleta.allBicis.length; i++) {
        if (Bicicleta.allBicis[i].id == aBici.id) {
            Bicicleta.allBicis[i] = aBici;
            break;
        }
    }
}

/*
const a = new Bicicleta(1,'rojo','urbana',[-34.6012424,-58.3861497]);
const b = new Bicicleta(2,'blanco','urbana',[-34.596932,-58.3808287]);

Bicicleta.add(a);
Bicicleta.add(b);


module.exports = Bicicleta;
*/