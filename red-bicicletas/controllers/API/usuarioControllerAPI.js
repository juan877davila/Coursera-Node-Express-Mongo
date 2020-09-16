var User = require('./../../models/usuario');

exports.user_list = (req, res) => {
    User.find({}, (err, users) => {
        res.status(200).json({
            'usuarios': users
        });
    });
};

exports.user_create = (req, res) => {
    var user = new User({ nombre: req.body.nombre });

    user.save((err) => {
        res.status(200).json(user);
    });
};

exports.user_reserve = (req, res) => {
    User.findById(req.body.id, (err, user) => {
        console.log(user);

        user.reserve(req.body.biciId, req.body.since, req.body.until, (err) => {
            console.log('reservada');

            res.status(200).send();
        });
    });
};