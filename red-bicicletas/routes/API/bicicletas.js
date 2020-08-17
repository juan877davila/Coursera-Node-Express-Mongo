const express=require('express');
const router=express.Router();
const bicicletaController=require('../../controllers/API/bicicletaControllerAPI');

router.get('/',bicicletaController.bicicleta_list);
router.post('/create',bicicletaController.bicicleta_create);
router.post('/delete',bicicletaController.bicicleta_delete);

module.exports = router;
