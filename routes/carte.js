// Importation des modules nécessaires
const express = require('express');
const carteController = require('../controllers/carteController');

// Création du routeur
const router = express.Router();

// Définition des routes pour les cartes
router.get('/cartes', carteController.getCartes); // Récupérer toutes les cartes
router.post('/carte', carteController.createCarte); // Créer une nouvelle carte
router.get('/carte/:id', carteController.getCarte); // Récupérer une carte spécifique par ID
router.put('/carte/:id', carteController.updateCarte); // Mettre à jour une carte spécifique par ID
router.delete('/carte/:id', carteController.deleteCarte); // Supprimer une carte spécifique par ID
router.get('/carteAleatoire/:idUser', carteController.getCarteAleatoire); // Récupérer une carte aléatoire pour un utilisateur spécifique
router.post('/carte/:carteId/:userId/reponse', carteController.reponseCarte); // Poster une réponse pour une carte spécifique et un utilisateur spécifique

// Exportation du routeur
module.exports = router;
