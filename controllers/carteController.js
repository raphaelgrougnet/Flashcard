const Carte = require('../models/carte');
const UserCarte = require('../models/userCarte');
const User = require('../models/user');

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
  const { question, reponse, paquetId } = req.body;

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

  const id = req.params.id;

  try {
    // Vérifier si l'ID de la carte est valide
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID de carte invalide');
      error.statusCode = 400;
      throw error;
    }
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
  const id = req.params.id;
  const { question, reponse, paquetId } = req.body;

  try {
    // Vérifier si l'ID de la carte est valide
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID de carte invalide');
      error.statusCode = 400;
      throw error;
    }
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
  const id = req.params.id;

  try {
    // Vérifier si l'ID de la carte est valide
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID de carte invalide');
      error.statusCode = 400;
      throw error;
    }

    const carte = await Carte.findById(id);

    if (!carte){
      const error = new Error('Aucune carte trouvée !');
      error.statusCode = 404;
      throw error;
    }

    // Supprimer la carte de la base de données
    await Carte.findByIdAndRemove(id);

    // Renvoyer un code de statut 204 (No Content)
    res.status(204).json();
  } catch (error) {
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
  const idUser = req.params.idUser;

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
    const dateDuJour = new Date();
    // On cherche les cartes qui ne sont pas de l'utilisateur ou dont la date est inférieure à la date du jour
    const cartesPossibles = await UserCarte.find({
      $or: [
        { userId: { $ne: idUser } },
        { 
          userId: idUser,
          date: { $lt: dateDuJour }
        }
      ]
    });
  
    // Choisir une carte aléatoire parmi les cartes possibles
    const carteAleatoire = cartesPossibles[Math.floor(Math.random() * cartesPossibles.length)];
    // Récupérer la carte de la base de données
    const carte = await Carte.findById(carteAleatoire.carteId);
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
  const carteId = req.params.carteId;
  const userId = req.params.userId;
  const { reponse } = req.body;

  try {
    // Récupérer la carte de la base de données
    const carte = await Carte.findById(carteId);
    if (!carte) {
      const error = new Error('Carte non trouvée');
      error.statusCode = 404;
      throw error;
    }

    // Récupérer l'utilisateur de la base de données
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('Utilisateur non trouvé');
      error.statusCode = 404;
      throw error;
    }

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
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};