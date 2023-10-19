const Carte = require('../models/carte'); // Importation du modèle Carte
const UserCarte = require('../models/userCarte'); // Importation du modèle UserCarte
const User = require('../models/user'); // Importation du modèle User

// Récupérer toutes les cartes
exports.getCartes = async (req, res, next) => {
  try {
    // Récupérer toutes les cartes de la base de données
    const cartes = await Carte.find();
    if (!cartes) {
      const error = new Error('Aucune carte trouvée !');
      error.statusCode = 404;
      throw error;
    }
    // Renvoyer les cartes en format JSON
    res.status(200).json(cartes);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Créer une nouvelle carte
exports.createCarte = async (req, res, next) => {
  const { question, reponse, paquetId } = req.body; // Récupération des données de la requête

  try {
    // Créer une nouvelle instance de carte avec les données reçues
    const carte = new Carte({ question, reponse, paquetId });

    // Sauvegarder la nouvelle carte dans la base de données
    const carteCreee = await carte.save();

    // Renvoyer la nouvelle carte en format JSON
    res.location("/carte/" + carteCreee.id);
    res.status(201).json(carteCreee);
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Récupérer une carte
exports.getCarte = async (req, res, next) => {

  const id = req.params.id; // Récupération de l'ID de la carte

  try {
    // Récupérer la carte de la base de données
    const carte = await Carte.findById(id);

    if (!carte){
      const error = new Error('Aucune carte trouvée !');
      error.statusCode = 404;
      throw error;
    };

    // Renvoyer la carte en format JSON
    res.status(200).json(carte)
  } catch (error) {
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID de carte invalide';
    }
    if (error.name === 'ValidationError'){
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Mettre à jour une carte
exports.updateCarte = async (req, res, next) => {
  const id = req.params.id; // Récupération de l'ID de la carte
  const { question, reponse, paquetId } = req.body; // Récupération des nouvelles données de la carte

  try {
    // Récupérer la carte de la base de données
    const carte = await Carte.findById(id);

    if (!carte){
      const error = new Error('Aucune carte trouvée !');
      error.statusCode = 404;
      throw error;
    };

    // Mettre à jour les informations de la carte
    carte.question = question;
    carte.reponse = reponse;
    carte.paquetId = paquetId;

    // Sauvegarder les modifications dans la base de données
    const carteModifiee = await carte.save();

    // Renvoyer la carte modifiée en format JSON
    res.status(200).json(carteModifiee)
  } catch (error) {
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID de carte invalide';
    }
    if (error.name === 'ValidationError'){
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Supprimer une carte
exports.deleteCarte = async (req, res, next) => {
  const id = req.params.id; // Récupération de l'ID de la carte

  try {
    const carte = await Carte.findById(id); // Récupération de la carte

    if (!carte){
      const error = new Error('Aucune carte trouvée !');
      error.statusCode = 404;
      throw error;
    }

    // Supprimer la carte de la base de données
    await Carte.findByIdAndRemove(id);

    // Renvoyer un code de statut 204 (No Content)
    res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID de carte invalide';
    }
    if (error.name === 'ValidationError'){
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Récupérer une carte aléatoire
exports.getCarteAleatoire = async (req, res, next) => {
  const idUser = req.params.idUser; // Récupération de l'ID de l'utilisateur

  try {
    // Récupérer l'utilisateur de la base de données
    const user = await User.findById(idUser);
    
    // Si l'utilisateur n'existe pas, on lance une erreur
    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    // Récupérer les cartes de l'utilisateur
    const dateDuJour = new Date(); // Récupération de la date du jour
    
    // On cherche les cartes qui ne sont pas de l'utilisateur ou dont la date est inférieure à la date du jour
    const cartesRelationsPossibles = await UserCarte.find({
      userId: user["_id"],
      dateProchaineRevision: { $lt: dateDuJour } // Cartes dont la date est inférieure à la date du jour
    }, 
    { carteId: 1, _id: 0 });

    // Boucle sur les cartes pour convertir en string
    for (let i = 0; i < cartesRelationsPossibles.length; i++) {
      cartesRelationsPossibles[i] = cartesRelationsPossibles[i]["carteId"].toString();
    }

    // Récupérer toutes les cartes
    const toutesLesCartes = await Carte.find({relationsUsers: {$ne: idUser}}, {_id: 1});

    // On combine les deux listes de cartes
    const cartesFinales = [...cartesRelationsPossibles, ...toutesLesCartes];
    // Si aucune carte n'est trouvée, on lance une erreur
    if (cartesFinales.length === 0) {
      const error = new Error('Aucune carte trouvée');
      error.statusCode = 404;
      throw error;
    }
    // Choisir une carte aléatoire parmi les cartes possibles
    const carteAleatoire = cartesFinales[Math.floor(Math.random() * cartesFinales.length)];

    // Récupérer la carte de la base de données
    const carte = await Carte.findById(carteAleatoire);
    // Si la carte n'existe pas, on lance une erreur
    if (!carte) {
      const error = new Error('Carte non trouvée');
      error.statusCode = 404;
      throw error;
    }
    // Renvoyer la carte en format JSON
    res.status(200).json(carte);
  } catch (err) {
    // Gestion des erreurs
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Répondre à une carte
exports.reponseCarte = async (req, res, next) => {
  const carteId = req.params.carteId; // Récupération de l'ID de la carte
  const userId = req.params.userId; // Récupération de l'ID de l'utilisateur
  const { reponse } = req.body; // Récupération de la réponse de l'utilisateur

  try {
    // Récupérer la carte de la base de données
    const carte = await Carte.findById(carteId);
    if (!carte) {
      const error = new Error('Carte non trouvée');
      error.statusCode = 404;
      throw error;
    }

    carte["relationsUsers"].push(userId);
    await carte.save();

    // Récupérer l'utilisateur de la base de données
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }

    user["relationsCartes"].push(carteId);
    await user.save();

    // Récupérer la relation entre l'utilisateur et la carte
    let userCarte = await UserCarte.findOne({userId: userId, carteId: carteId});

    // Si la relation n'existe pas, la créer
    if (!userCarte) {
      userCarte = new UserCarte({
        userId: userId,
        carteId: carteId,
        bonnesReponses: 0,
        dateProchaineRevision: Date.now()
      });
    }



    // Mettre à jour le nombre de bonnes réponses en fonction de la réponse de l'utilisateur
    if (reponse === 'ok') {
      userCarte.bonnesReponses++;
    }
    else if (reponse === 'ko') {
      userCarte.bonnesReponses = 0;
    }
    else {
      const error = new Error('Réponse invalide');
      error.statusCode = 400;
      throw error;
    }
    // Calculer la date de la prochaine révision
    const x = userCarte.bonnesReponses;
    const nbre_de_jour = x * x + x + 1;
    userCarte.dateProchaineRevision = nbre_de_jour === 1 ? Date.now() : Date.now() + (nbre_de_jour * 86400000);
    // Sauvegarder les modifications dans la base de données
    const userCarteModifiee = await userCarte.save();
    // Renvoyer la relation modifiée en format JSON
    res.status(200).json(userCarteModifiee);
  } catch (err) {
    if (err.kind === 'ObjectId' && err.name === 'CastError') {
      err.statusCode = 400;
      err.message = 'ID invalide';
    }
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};