var express = require('express');
var router = express.Router();
var usuarioController = require('../controllers/usuario');

router.get('/',loggedIn, usuarioController.usuario_list);
router.get('/create', usuarioController.usuario_create_get);
router.post('/create', usuarioController.usuario_create_post);
router.get('/createAccount', usuarioController.usuario_create_get_Account);
router.post('/createAccount', usuarioController.usuario_create_post_Account);
router.post('/delete/:id', usuarioController.usuario_delete_post);
router.get('/update/:id', usuarioController.usuario_update_get);
router.post('/update/:id', usuarioController.usuario_update_post);
router.get('/detail/:id', usuarioController.usuario_detail_get);

//funcion que verifica si el usuario esta logueado
function loggedIn(req, res, next){
    if(req.user){
      next();
    }else{
      console.log('usuario sin loguearse');
      res.redirect('/login');
    }
  }

module.exports = router;