const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const breedSchema = Schema({
  breed: { type: String, required: true },
  description: String,
  eggColor: { type: String, required: true, lowercase: true },
  eggSize: { type: String, lowercase: true },
  apaClass: {
    name: { type: String, required: true },
    abbreviation: { type: String },
  },
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

breedSchema.statics.findByBreed = function (breed) {
  return this.where({ breed: new RegExp(breed, 'i') });
};

breedSchema.query.byApaClass = function (apaClass) {
  return this.find({ 'apaClass.name': new RegExp(apaClass, 'i') });
};

breedSchema.query.byEggColor = function (color) {
  return this.find({ eggColor: new RegExp(color, 'i') });
};

let Breed = mongoose.model('Breed', breedSchema);

module.exports.Breed = Breed;
