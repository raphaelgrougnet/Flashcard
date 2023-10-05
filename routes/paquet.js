const express = require('express');

const paquetController = require('../controllers/paquetController');

const router = express.Router();

router.get('/paquets', paquetController.getPaquets);
router.post('/paquet', paquetController.createPaquet);
router.get('/paquet/:id', paquetController.getPaquet);
router.put('/paquet/:id', paquetController.updatePaquet);
router.delete('/paquet/:id', paquetController.deletePaquet);
router.get('/paquets/recherche/:mot', paquetController.recherchePaquets);


module.exports = router;
