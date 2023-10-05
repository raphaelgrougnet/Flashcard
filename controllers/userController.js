const User = require('../models/user'); 

// Récupérer tous les utilisateurs
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(users);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try{
    const { courriel, nom, prenom } = req.body;
    
    const user = new User({nom, prenom, courriel});

    const utilisateurCree = await user.save();
    

    res.location(`/user/${utilisateurCree._id}`);
    res.status(201).json(utilisateurCree);
  }
  catch (error) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID d\'utilisateur invalide');
      error.statusCode = 400;
      throw error;
    }
    
    const user = await User.findById(id);

    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };

    res.status(200).json(user)
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

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID d\'utilisateur invalide');
      error.statusCode = 400;
      throw error;
    }
    
    const user = await User.findById(id);

    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };

    const { courriel, nom, prenom } = req.body;

    user.courriel = courriel;
    user.nom = nom;
    user.prenom = prenom;
    await user.save();

    res.status(200).json(user)
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

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID d\'utilisateur invalide');
      error.statusCode = 400;
      throw error;
    }
    
    const user = await User.findById(id);

    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };

    const promise = await User.deleteOne(user);
    console.log("🚀 ~ file: userController.js:129 ~ exports.deleteUser ~ promise:", promise)

    if (promise["deletedCount"] !== 1){
      const error = new Error('Erreur lors de la suppression de l\'utilisateur');
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json(user)
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