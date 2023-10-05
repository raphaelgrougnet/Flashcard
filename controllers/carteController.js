const Carte = require('../models/carte');

// Récupérer toutes les cartes
exports.getCartes = async (req, res, next) => {
  try {
    const cartes = await Carte.find();
    if (!cartes) {
      const error = new Error('Aucune carte trouvée !');
      error.statusCode = 404;
      throw error;
    }
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
  try {
    const { question, reponse, paquetId } = req.body;

    const carte = new Carte({ question, reponse, paquetId });

    const carteCreee = await carte.save();

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


