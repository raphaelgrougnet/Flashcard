const Paquet = require('../models/paquet');


// Récupérer tous les paquets
exports.getPaquets = async (req, res, next) => {
  try {
    const paquets = await Paquet.find();
    if (!paquets) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(paquets);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Créer un nouveau paquet
exports.createPaquet = async (req, res, next) => {
  const { nom, description, userId } = req.body;

  const paquet = new Paquet({
    nom,
    description,
    userId,
  });

  try {
    const paquetCree = await paquet.save();
    res.location("/paquet/" + paquetCree.id);
    res.status(201).json(paquetCree);
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
