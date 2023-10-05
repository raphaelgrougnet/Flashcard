const mongoose = require('mongoose');

const userCarteRelationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  carteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carte',
  },
  bonnesReponses: {
    type: Number,
  },
  dateProchaineRevision: {
    type: Date,
  }
});

module.exports = mongoose.model('UserCarteRelation', userCarteRelationSchema);
