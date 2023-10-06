const express = require('express');
const carteController = require('../controllers/carteController');
const router = express.Router();

router.get('/cartes', carteController.getCartes);
router.post('/carte', carteController.createCarte);
router.get('/carte/:id', carteController.getCarte);
router.put('/carte/:id', carteController.updateCarte);
router.delete('/carte/:id', carteController.deleteCarte);
router.get('/carteAleatoire/:idUser', carteController.getCarteAleatoire);
router.post('/carte/:carteId/:userId/reponse', carteController.reponseCarte);

module.exports = router;
