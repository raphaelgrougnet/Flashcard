// Importation des modules nécessaires
const express = require('express');

// Importation du contrôleur de paquets
const paquetController = require('../controllers/paquetController');

// Création du routeur
const router = express.Router();

// Définition des routes pour les paquets
router.get('/paquets', paquetController.getPaquets); // Récupérer tous les paquets
router.post('/paquet', paquetController.createPaquet); // Créer un nouveau paquet
router.get('/paquet/:id', paquetController.getPaquet); // Récupérer un paquet spécifique par ID
router.put('/paquet/:id', paquetController.updatePaquet); // Mettre à jour un paquet spécifique par ID
router.delete('/paquet/:id', paquetController.deletePaquet); // Supprimer un paquet spécifique par ID
router.get('/paquets/recherche/:mot', paquetController.recherchePaquets); // Rechercher des paquets par mot

// Exportation du routeur
module.exports = router;
