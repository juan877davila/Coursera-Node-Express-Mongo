var express = require('express');
var router = express.Router();
var authApi = require('./../../controllers/api/AuthApi');

router.post('/authenticate', authApi.authenticate);

module.exports = router;