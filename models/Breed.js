const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const breedSchema = Schema({
  breed: { type: String, required: true },
  description: String,
  eggColor: { type: String, required: true },
  eggSize: String,
  apaClass: { type: String, required: true },
  purpose: String,
  eggProduction: String,
  eggsPerYear: String,
  temperament: String,
  coldTolerance: String,
  heatTolerance: String,
  varieties: [
    {
      variety: String,
      comb: String,
      description: String,
    },
  ],
});

let Breed = mongoose.model('Breed', breedSchema);

module.exports.Breed = Breed;
