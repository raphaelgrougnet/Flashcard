const express = require('express'); // Importation du module express

const userController = require('../controllers/userController'); // Importation du contrôleur utilisateur

const router = express.Router(); // Création du routeur

router.get('/users', userController.getUsers); // Récupérer tous les utilisateurs
router.get('/user/:id', userController.getUser); // Récupérer un utilisateur spécifique par ID
router.post('/user', userController.createUser); // Créer un nouvel utilisateur
router.put('/user/:id', userController.updateUser); // Mettre à jour un utilisateur spécifique par ID
router.delete('/user/:id', userController.deleteUser); // Supprimer un utilisateur spécifique par ID


module.exports = router; // Exportation du routeur
