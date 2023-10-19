const mongoose = require('mongoose');

// Créer un schéma pour les users
const userSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "Le nom de l'utilisateur est requis"],
    maxlength: [50, 'Le nom doit contenir au plus 50 caractères'],
  },
  prenom: {
    type: String,
    required: [true, "Le prenom de l'utilisateur est requis"],
    maxlength: [50, 'Le prenom doit contenir au plus 50 caractères']
  },
  courriel: {
    type: String,
    validate: {
      validator: function(v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);// true ou false si le courriel est valide ou non
      },
      message: props => `${props.value} n'est pas un courriel valide!`
    },
    required: [true, "Le courriel de l'utilisateur est requis"],
    unique: true,
  },
  relationsCartes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserCarteRelation',
    },
  ],
},{
	timestamps: true
});




// Créer un modèle à partir du schéma
module.exports = mongoose.model('User', userSchema);