// Importation des modèles nécessaires
const Paquet = require('../models/paquet'); // Modèle pour les paquets
const User = require('../models/user'); // Modèle pour les utilisateurs
const Carte = require('../models/carte'); // Modèle pour les cartes


// Récupérer tous les paquets
exports.getPaquets = async (req, res, next) => {
  try {
    // Récupération de tous les paquets depuis la base de données
    const paquets = await Paquet.find();
    if (!paquets) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }
    // Envoi des paquets en réponse
    res.status(200).json(paquets);
  } catch (err) {
    // Gestion des erreurs
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Créer un nouveau paquet
exports.createPaquet = async (req, res, next) => {
  // Récupération des données du paquet à partir de la requête
  const { nom, description, userId } = req.body;

  // Création d'un nouvel objet Paquet
  const paquet = new Paquet({
    nom,
    description,
    userId,
  });

  try {
    // Vérification de l'existence de l'utilisateur
    if (!userId) {
      const error = new Error('Le paquet doit être associé à un utilisateur (un userId est requis)');
      error.statusCode = 400;
      throw error;
    }

    // Recherche de l'utilisateur par son ID
    const user = await User.findById(userId);

    // Si l'utilisateur n'existe pas, on lance une erreur
    if (!user) {
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    }

    // Sauvegarde du nouveau paquet dans la base de données
    const paquetCree = await paquet.save();
    // Ajout de l'URL du nouveau paquet dans l'en-tête Location de la réponse
    res.location("/paquet/" + paquetCree.id);
    // Envoi du paquet créé en réponse
    res.status(201).json(paquetCree);
  } catch (error) {
    // Gestion des erreurs
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Récupérer un paquet spécifique
exports.getPaquet = async (req, res, next) => {
  // Récupération de l'ID du paquet à partir de la requête
  const id = req.params.id;

  try {
    // Recherche du paquet par son ID
    const paquet = await Paquet.findById(id);

    // Si le paquet n'existe pas, on lance une erreur
    if (!paquet) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }

    // Recherche des cartes associées au paquet
    const cartes = await Carte.find({ paquetId: id });

    // Si aucune carte n'est associée au paquet, on initialise un objet vide
    if (!cartes) {
      cartes = {}
    }
    
    // Création d'un objet contenant le paquet et ses cartes associées
    const paquetCartes = {"paquet" : paquet, "cartes" : cartes};

    // Envoi du paquet et de ses cartes associées en réponse
    res.status(200).json(paquetCartes);
  } catch (error) {
    // Gestion des erreurs
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID de paquet invalide';
    }
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Mettre à jour un paquet spécifique
exports.updatePaquet = async (req, res, next) => {
  // Récupération de l'ID du paquet et des données à mettre à jour à partir de la requête
  const id = req.params.id;
  const { nom, description, userId } = req.body;

  try {
     // Recherche du paquet par son ID
    const paquet = await Paquet.findById(id);

    // Si le paquet n'existe pas, on lance une erreur
    if (!paquet) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }

    // Mise à jour des données du paquet
    paquet.nom = nom;
    paquet.description = description;
    paquet.userId = userId;

    // Sauvegarde du paquet modifié dans la base de données
    const paquetModifie = await paquet.save();
    // Envoi du paquet modifié en réponse
    res.status(200).json(paquetModifie);
  } catch (error) {
    // Gestion des erreurs
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID de paquet invalide';
    }
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Supprimer un paquet spécifique
exports.deletePaquet = async (req, res, next) => {
  // Récupération de l'ID du paquet à partir de la requête
  const id = req.params.id;

  try {
    // Recherche du paquet par son ID
    const paquet = await Paquet.findById(id);

    // Si le paquet n'existe pas, on lance une erreur
    if (!paquet) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }

    // Suppression du paquet de la base de données
    await Paquet.findByIdAndRemove(id);

    // Envoi d'une réponse avec un code de statut 204 (No Content)
    res.status(204).send();
  } catch (error) {
    // Gestion des erreurs
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID de paquet invalide';
    }
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

// Rechercher un paquet par mot
exports.recherchePaquets = async (req, res, next) => {
  // Récupération du mot de recherche à partir de la requête
  const mot = req.params.mot;

  try {
    // Recherche des paquets dont le nom contient le mot de recherche
    const paquets = await Paquet.find({ nom: { $regex: mot, $options: 'i' } }).sort({ createdAt: 1 });

    // Si aucun paquet n'a été trouvé, on lance une erreur
    if (paquets.length === 0) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }

    // Envoi des paquets trouvés en réponse
    res.status(200).json(paquets);
  } catch (error) {
    // Gestion des erreurs
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
