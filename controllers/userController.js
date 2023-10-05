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
    const user = await User.findById(id);

    if (!user){
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    };
    res.status(200).json(user)
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};