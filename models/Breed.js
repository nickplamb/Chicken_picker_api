// http://nagyv.github.io/estisia-wall/models.js.html
/**
 * Breed Model
 * @module breedModel
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Breed schema
 */
const breedSchema = Schema({
  // _id: { type: Schema.ObjectId, auto: true },
  breed: { type: String, required: true },
  description: String,
  origin: String,
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
  imgUrl: { type: String, lowercase: true },
});

/**
 * Query helper to return a single breed by breed name
 * @alias byBreed
 * @memberof! module:breedModel~Breed
 * @instance
 * @param {string} breed Name of a breed
 * @returns {object} Query class instance with found document.
 * @example Breed.findOne().byBreed("breed name")
 */
breedSchema.query.byBreed = function (breed) {
  return this.where({ breed: new RegExp(breed, 'i') });
};

/**
 * Query helper to return all breeds with APA Class name
 * @alias byApaClass
 * @memberof! module:breedModel~Breed
 * @instance
 * @param {string} apaClass Name of an APA Class
 * @returns {object} Query class instance with found documents.
 * @example Breed.find().byApaClass("class name")
 */
breedSchema.query.byApaClass = function (apaClass) {
  return this.find({ 'apaClass.name': new RegExp(apaClass, 'i') });
};

/**
 * Query helper to return all breeds with specified egg color
 * @alias byEggColor
 * @memberof! module:breedModel~Breed
 * @instance
 * @param {string} color an egg color
 * @returns {object} Query class instance with found documents.
 * @example Breed.find().byEggColor("egg color")
 */
breedSchema.query.byEggColor = function (color) {
  return this.find({ eggColor: new RegExp(color, 'i') });
};

/**
 * Breed model
 * @class Breed
 */
let Breed = mongoose.model('Breed', breedSchema);

module.exports.Breed = Breed;
