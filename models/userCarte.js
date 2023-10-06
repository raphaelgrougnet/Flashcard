const mongoose = require('mongoose');

const userCarteRelationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le userId est requis'],
  },
  carteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carte',
    required: [true, 'Le carteId est requis'],
  },
  bonnesReponses: {
    type: Number,
    default: 0,
    required: [true, 'Le nombre de bonnes réponses est requis'],
  },
  dateProchaineRevision: {
    type: Date,
    required: [true, 'La date de prochaine révision est requise'],
    default: Date.now(),
  }
});

module.exports = mongoose.model('UserCarteRelation', userCarteRelationSchema);
