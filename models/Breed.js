const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const breedSchema = Schema({
  breed: { type: String, required: true },
  description: String,
  eggColor: { type: String, required: true, lowercase: true },
  eggSize: { type: String, lowercase: true },
  apaClass: { type: String, required: true },
  purpose: { type: String, lowercase: true },
  eggProduction: { type: String, lowercase: true },
  eggsPerYear: { type: String, lowercase: true },
  temperament: { type: String, lowercase: true },
  coldTolerance: { type: String, lowercase: true },
  heatTolerance: { type: String, lowercase: true },
  varieties: [
    {
      variety: { type: String, lowercase: true },
      comb: { type: String, lowercase: true },
      description: String,
    },
  ],
});

breedSchema.query.byBreed = function (breed) {
  return this.where({ breed: new RegExp(breed, 'i') });
};

let Breed = mongoose.model('Breed', breedSchema);

module.exports.Breed = Breed;
