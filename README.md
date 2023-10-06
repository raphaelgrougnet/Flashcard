# Projet Flashcard

Ce projet est une application de flashcards. Il utilise Node.js, Express et MongoDB pour créer une API RESTful.

### Installation

1. Clonez le dépôt
2. Démarrez MongoDBCompass
3. Installez les dépendances avec `npm install`
4. Démarrez le serveur avec `npm run start`
5. Installez dans Postman les tests avec le fichier [`Flashcard.postman_collection.json`](https://github.com/raphaelgrougnet/Flashcard/blob/main/Flashcard.postman_collection.json)
6. Allez sur la route `db/seed` dans Postman pour remplir la base de données
   
### Structure du projet

Le projet est structuré comme suit :

- [`app.js`](https://github.com/raphaelgrougnet/Flashcard/blob/main/app.js) : Le point d'entrée de l'application. Il configure le serveur Express et connecte l'application à la base de données MongoDB.
- [`package.json`](https://github.com/raphaelgrougnet/Flashcard/blob/main/package.json) : Contient la liste des dépendances du projet et les scripts npm.
- [`models/`](https://github.com/raphaelgrougnet/Flashcard/blob/main/models) : Contient les modèles Mongoose pour les utilisateurs, les paquets et les cartes.
- [`controllers/`](https://github.com/raphaelgrougnet/Flashcard/blob/controllers) : Contient les contrôleurs pour les utilisateurs, les paquets et les cartes.
- [`routes/`](https://github.com/raphaelgrougnet/Flashcard/blob/main/routes) : Contient les routes pour les utilisateurs, les paquets et les cartes.
- [`seeds/`](https://github.com/raphaelgrougnet/Flashcard/blob/main/seeds) : Contient les données initiales pour la base de données.
  
### API

L'API fournit les points de terminaison suivants :

#### Routes Users
- `GET /users` : Récupère tous les utilisateurs.
- `GET /user/:id` : Récupère un utilisateur spécifique par ID.
- `POST /user` : Crée un nouvel utilisateur.
- `PUT /user/:id` : Met à jour un utilisateur spécifique par ID.
- `DELETE /user/:id` : Supprime un utilisateur spécifique par ID.

#### Routes Paquets
- `GET /paquets` : Récupère tous les paquets.
- `POST /paquet` : Crée un nouveau paquet.
- `GET /paquet/:id` : Récupère un paquet spécifique par ID.
- `PUT /paquet/:id` : Met à jour un paquet spécifique par ID.
- `DELETE /paquet/:id` : Supprime un paquet spécifique par ID.
  
#### Routes Cartes
- `GET /cartes` : Récupère toutes les cartes.
- `POST /carte` : Crée une nouvelle carte.
- `GET /carte/:id` : Récupère une carte spécifique par ID.
- `PUT /carte/:id` : Met à jour une carte spécifique par ID.
- `DELETE /carte/:id` : Supprime une carte spécifique par ID.
- `POST /carte/:carteId/:userId/reponse` : Poster une réponse pour une carte spécifique et un utilisateur spécifique.
  
### Modèles de données

- `User` : Représente un utilisateur. Chaque utilisateur a un nom, un prénom, un courriel et une liste de relations avec des cartes.
- `Paquet` : Représente un paquet de cartes. Chaque paquet a un nom, une description et un utilisateur associé.
- `Carte` : Représente une carte de flashcard. Chaque carte a une question, une réponse et un paquet associé.
- `UserCarteRelation` : Représente la relation entre un utilisateur et une carte. Il contient le nombre de bonnes réponses de l'utilisateur pour cette carte et la date de la prochaine révision.
Licence

Ce projet est sous licence MIT.
