const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

//Rootes d'authentification
router.post('/api/auth/signup',userCtrl.signup);
router.post('/api/auth/login',userCtrl.login);


module.exports = router;