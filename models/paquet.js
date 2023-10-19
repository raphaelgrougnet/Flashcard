const mongoose = require('mongoose');

// Créer un schéma pour les paquets
const paquetSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'Le nom du paquet est requis'],
    maxlength: [50, 'Le nom doit contenir au plus 50 caractères'],
    validate: {
      validator: async function(v) {
        return await this.model('Paquet').findOne({ nom: v, userId: this.userId }).exec().then(paquet => !paquet);
      },
      message: props => `Un paquet avec ce nom (${props.value}) existe déjà pour cet utilisateur`
    }

  },
  description: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le paquet doit être associé à un utilisateur (un userId est requis)']
  }
},{
	timestamps: true
});

// Créer un modèle à partir du schéma
module.exports = mongoose.model('Paquet', paquetSchema);

