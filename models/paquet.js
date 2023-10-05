const mongoose = require('mongoose');

// Créer un schéma pour les paquets
const paquetSchema = new mongoose.Schema({
  nom: {
    type: String,
  },
  description: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
},{
	timestamps: true
});

// Créer un modèle à partir du schéma
module.exports = mongoose.model('Paquet', paquetSchema);

