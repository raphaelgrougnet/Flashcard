const mongoose = require('mongoose');

// Créer un schéma pour les cartes
const carteSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  reponse: {
    type: String,
  },
  paquetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Paquet',
  },
  relationsUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserCarteRelation',
    },
  ],
},{
	timestamps: true
});

// Créer un modèle à partir du schéma
module.exports = mongoose.model('Carte', carteSchema);
