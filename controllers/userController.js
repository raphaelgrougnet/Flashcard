const User = require('../models/user'); 

// Récupérer tous les utilisateurs
exports.getUsers = async (req, res, next) => {
  try {
    // Récupère tous les utilisateurs
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
    
  // Crée un nouvel utilisateur
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
  // Récupère l'id de l'utilisateur
  const id = req.params.id;

  try {
    // Si l'id n'est pas valide, on lance une erreur
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID d\'utilisateur invalide');
      error.statusCode = 400;
      throw error;
    }
    // Récupère l'utilisateur
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
  // Récupère l'id de l'utilisateur
  const id = req.params.id;

  try {
    // Si l'id n'est pas valide, on lance une erreur
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID d\'utilisateur invalide');
      error.statusCode = 400;
      throw error;
    }
    
    // Récupère l'utilisateur
    const user = await User.findById(id);

    // Si aucun utilisateur n'est trouvé, on lance une erreur
    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };

    // Récupère les données du body
    const { courriel, nom, prenom } = req.body;

    // Met à jour l'utilisateur
    user.courriel = courriel;
    user.nom = nom;
    user.prenom = prenom;
    await user.save();

    // Renvoie l'utilisateur mis à jour
    res.location(`/user/${user._id}`);
    res.status(200).json(user)
  } catch (error) {
    // Si une erreur est survenue, on la renvoie
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
  // Récupère l'id de l'utilisateur
  const id = req.params.id;

  try {
    // Si l'id n'est pas valide, on lance une erreur
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID d\'utilisateur invalide');
      error.statusCode = 400;
      throw error;
    }
    
    // Récupère l'utilisateur
    const user = await User.findById(id);

    // Si aucun utilisateur n'est trouvé, on lance une erreur
    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };

    // Supprime l'utilisateur
    const promise = await User.deleteOne(user);

    // Si la suppression n'a pas fonctionné, on lance une erreur
    if (promise["deletedCount"] !== 1){
      const error = new Error('Erreur lors de la suppression de l\'utilisateur');
      error.statusCode = 500;
      throw error;
    }

    // Renvoie l'utilisateur supprimé
    res.status(200).json(user)
  } catch (error) {
    // Si une erreur est survenue, on la renvoie
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