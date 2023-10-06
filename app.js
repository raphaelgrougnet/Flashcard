const express = require('express'); // Importation du module express
const bodyParser = require('body-parser'); // Importation du module body-parser pour analyser les requêtes HTTP
const mongoose = require('mongoose'); // Importation du module mongoose pour la gestion de la base de données
const carteRoutes = require('./routes/carte'); // Importation des routes pour les cartes
const paquetRoutes = require('./routes/paquet'); // Importation des routes pour les paquets
const userRoutes = require('./routes/user'); // Importation des routes pour les utilisateurs
const seed = require("./routes/db"); // Importation des routes pour la base de données
const app = express(); // Création de l'application express

const port = 3000; // Définition du port d'écoute

app.use(express.json()); // Utilisation de express.json pour analyser les requêtes JSON

app.use((req, res, next) => { // Middleware pour gérer les headers de réponse
  res.setHeader('Access-Control-Allow-Origin', '*'); // Autorisation de l'accès à toutes les origines
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE' // Autorisation des méthodes HTTP
  );
  next(); // Passage au prochain middleware
});

app.use(carteRoutes); // Utilisation des routes pour les cartes
app.use(paquetRoutes); // Utilisation des routes pour les paquets
app.use(userRoutes); // Utilisation des routes pour les utilisateurs
app.use(seed); // Utilisation des routes pour la base de données


app.use((error, req, res, next) => { // Middleware pour gérer les erreurs
  console.log("Erreur:", error); // Affichage de l'erreur dans la console
  const status = error.statusCode || 500; // Récupération du code d'état de l'erreur ou définition par défaut à 500
  const message = error.message; // Récupération du message de l'erreur
  const data = error.data; // Récupération des données de l'erreur
  res.status(status).json({ message: message, data: data }); // Envoi de la réponse avec le code d'état, le message et les données de l'erreur
});

mongoose
  .connect('mongodb://127.0.0.1:27017/flashcard') // Connexion à la base de données MongoDB
  .then(() => {
    app.listen(port); // Démarrage de l'écoute du serveur sur le port défini
		console.log("Serveur à l'écoute sur : http://localhost:" + port); // Affichage du message indiquant que le serveur est en écoute

  })
  .catch(err => console.log(err)); // Gestion de l'erreur de connexion à la base de données
