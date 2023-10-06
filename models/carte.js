const mongoose = require('mongoose');

// Créer un schéma pour les cartes
const carteSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'La question est requise']
  },
  reponse: {
    type: String,
    required: [true, 'La réponse est requise']
  },
  paquetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Le paquetId est requis'],
    ref: 'Paquet',
  },
  relationsUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserCarteRelation',
      required: [true, 'Le tableau de relations est requis']
    },
  ],
},{
	timestamps: true
});

// Créer un modèle à partir du schéma
module.exports = mongoose.model('Carte', carteSchema);
