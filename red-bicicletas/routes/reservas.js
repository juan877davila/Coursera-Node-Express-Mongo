var express = require('express');
var router = express.Router();
var reservaController = require('../controllers/reserva');

router.get('/', reservaController.reserva_list);
router.get('/create', reservaController.reserva_create_get);
router.post('/create', reservaController.reserva_create_post);
router.post('/delete/:id', reservaController.reserva_delete_post);
router.get('/update/:id', reservaController.reserva_update_get);
router.post('/update/:id', reservaController.reserva_update_post);
router.get('/detail/:id', reservaController.reserva_detail_get);

module.exports = router;