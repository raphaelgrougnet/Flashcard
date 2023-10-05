const express = require('express');

const paquetController = require('../controllers/paquetController');

const router = express.Router();

router.get('/paquets', paquetController.getPaquets);
router.post('/paquet', paquetController.createPaquet);


module.exports = router;
