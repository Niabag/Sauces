const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');

//rootes
router.post('/sauces', auth, multer, stuffCtrl.createSauces);

router.get('/sauces', auth, stuffCtrl.displaySauces);

router.get('/sauces/:id', auth, stuffCtrl.getOneSauces);

router.put('/sauces/:id', auth, multer, stuffCtrl.modifySauces);

router.delete('/sauces/:id', auth, stuffCtrl.deleteSauces);

router.post('/sauces/:id/like', auth, stuffCtrl.likeSauces);

module.exports = router;