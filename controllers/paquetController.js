const Paquet = require('../models/paquet');
const User = require('../models/user');
const Carte = require('../models/carte');


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
    if (!userId) {
      const error = new Error('Le paquet doit être associé à un utilisateur (un userId est requis)');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('Aucun utilisateur trouvé !');
      error.statusCode = 404;
      throw error;
    }

    const paquetExiste = await Paquet.findOne({ nom, userId });

    if (paquetExiste) {
      const error = new Error('Un paquet avec ce nom existe déjà !');
      error.statusCode = 400;
      throw error;
    }

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

// Récupérer un paquet spécifique
exports.getPaquet = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID de paquet invalide');
      error.statusCode = 400;
      throw error;
    }

    const paquet = await Paquet.findById(id);
    //! const cartes = await Carte.find({ paquetId: id });
    //! paquet.cartes = cartes;

    if (!paquet) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(paquet);
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

exports.updatePaquet = async (req, res, next) => {
  const id = req.params.id;
  const { nom, description, userId } = req.body;

  try {
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID de paquet invalide');
      error.statusCode = 400;
      throw error;
    }

    const paquet = await Paquet.findById(id);

    if (!paquet) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }

    paquet.nom = nom;
    paquet.description = description;
    paquet.userId = userId;

    const paquetModifie = await paquet.save();
    res.status(200).json(paquetModifie);
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

// Supprimer un paquet spécifique
exports.deletePaquet = async (req, res, next) => {
  const id = req.params.id;

  try {
    if (id.length !== 12 && id.length !== 24) {
      const error = new Error('ID de paquet invalide');
      error.statusCode = 400;
      throw error;
    }

    const paquet = await Paquet.findById(id);

    if (!paquet) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }

    const promise = await paquet.remove();

    if (!promise) {
      const error = new Error('Erreur lors de la suppression du paquet !');
      error.statusCode = 500;
      throw error;
    }


    res.status(200).json(paquet);
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

// Rechercher un paquet par mot
exports.recherchePaquets = async (req, res, next) => {
  const mot = req.params.mot;

  try {
    const paquets = await Paquet.find({ nom: { $regex: mot, $options: 'i' } }).sort({ createdAt: 1 });

    if (paquets.length === 0) {
      const error = new Error('Aucun paquet trouvé !');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json(paquets);
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
