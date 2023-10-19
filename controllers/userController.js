const User = require('../models/user'); // Importation du modèle User

// Récupérer tous les utilisateurs
exports.getUsers = async (req, res, next) => {
  try {
    // Récupère tous les utilisateurs de la base de données
    const users = await User.find();

    // Si aucun utilisateur n'est trouvé, on lance une erreur
    if (!users) {
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    }

    // Sinon on renvoie les utilisateurs
    res.status(200).json(users);
  } catch (err) {
    // Si une erreur est survenue, on la renvoie
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    // On passe l'erreur au prochain middleware
    next(err);
  }
};

// Crée un nouvel utilisateur
exports.createUser = async (req, res, next) => {
  // Récupère les données du body
  const { courriel, nom, prenom } = req.body;
    
  // Crée un nouvel utilisateur avec les données récupérées
  const user = new User({nom, prenom, courriel});
  try{
    // Sauvegarde l'utilisateur dans la base de données
    const utilisateurCree = await user.save();
    
    // Renvoie l'utilisateur créé
    res.location(`/user/${utilisateurCree._id}`);
    res.status(201).json(utilisateurCree);
  }
  catch (error) {
    // Si une erreur est survenue, on la renvoie
    if (error.code === 11000) {
      error = new Error('Ce courriel est déjà utilisé');
      error.statusCode = 400;
    }
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }

    // On passe l'erreur au prochain middleware
    next(error);
  }
};

// Récupérer un utilisateur spécifique
exports.getUser = async (req, res, next) => {
  // Récupère l'id de l'utilisateur depuis les paramètres de la requête
  const id = req.params.id;

  try {
    // Récupère l'utilisateur de la base de données
    const user = await User.findById(id);

    // Si aucun utilisateur n'est trouvé, on lance une erreur
    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };

    // Sinon on renvoie l'utilisateur
    res.status(200).json(user)
  } catch (error) {
    // Si une erreur est survenue, on la renvoie
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID d\'utilisateur invalide';
    }
    if (error.name === 'ValidationError'){
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    
    // On passe l'erreur au prochain middleware
    next(error);
  }
};

// Mettre à jour un utilisateur spécifique
exports.updateUser = async (req, res, next) => {
  // Récupère l'id de l'utilisateur depuis les paramètres de la requête
  const id = req.params.id;

  try {   
    // Récupère l'utilisateur de la base de données
    const user = await User.findById(id);

    // Si aucun utilisateur n'est trouvé, on lance une erreur
    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };

    // Récupère les données du body
    const { courriel, nom, prenom } = req.body;

    // Met à jour l'utilisateur avec les nouvelles données
    user.courriel = courriel;
    user.nom = nom;
    user.prenom = prenom;
    await user.save();

    // Renvoie l'utilisateur mis à jour
    res.location(`/user/${user._id}`);
    res.status(200).json(user)
  } catch (error) {
    // Si une erreur est survenue, on la renvoie
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID d\'utilisateur invalide';
    }
    if (error.name === 'ValidationError'){
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    
    // On passe l'erreur au prochain middleware
    next(error);
  }
};

// Supprimer un utilisateur spécifique
exports.deleteUser = async (req, res, next) => {
  // Récupère l'id de l'utilisateur depuis les paramètres de la requête
  const id = req.params.id;

  try {
     // Récupère l'utilisateur de la base de données
    const user = await User.findById(id);

    // Si aucun utilisateur n'est trouvé, on lance une erreur
    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };

    // Supprime l'utilisateur de la base de données
    await User.findByIdAndRemove(id);

    // Renvoie un code de statut 204 (No Content)
    res.status(204).send();
  } catch (error) {
    // Si une erreur est survenue, on la renvoie
    if (error.kind === 'ObjectId' && error.name === 'CastError') {
      error.statusCode = 400;
      error.message = 'ID d\'utilisateur invalide';
    }
    if (error.name === 'ValidationError'){
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    
    // On passe l'erreur au prochain middleware
    next(error);
  }
};