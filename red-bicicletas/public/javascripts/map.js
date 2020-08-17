const { json } = require("express");

const map = L.map('main_map').setView([-34.601242,-58.3861497],13);

L.titleLayer('https://{s}.title.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([-34.6012424,-58.3861497]).addTo(map);
L.marker([-34.596932,-58.3808287]).addTo(map);
L.marker([-34.599564,-58.3778777]).addTo(map);

$.ajax({
    datatype:"json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach((bici) => {
            L.marker(bici.ubicacion,{title:bici.id}).addTo(map)
        });
    }
})