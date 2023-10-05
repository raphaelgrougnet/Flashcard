const express = require('express');
const carteController = require('../controllers/carteController');
const router = express.Router();

router.get('/cartes', carteController.getCartes);
router.post('/carte', carteController.createCarte);

module.exports = router;
