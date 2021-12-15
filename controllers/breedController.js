/**
 * Breeds controller
 * @module breedsController
 */
/**
 * Breed model
 * @const Breed
 *
 */
const { Breed } = require('../models/Breed.js');

/**
 * Get all Breeds
 * Sets response headers and JSON encodes all breeds from the DB into response body.
 * @function
 * @param {Object} req - The HTTP request
 * @param {Object} res - The HTTP response
 * @returns {void} (res is not returned but set.)
 */
exports.breed_get_all_breeds = function (req, res) {
  Breed.find()
    .then((breeds) => {
      return res.status(200).json(breeds);
    })
    .catch((err) => {
      return res.status(500).send(`Something went wrong. Error: ${err}.`);
    });
};

/**
 * Get one breed by name
 * Sets response headers and JSON encodes single breed requested by breed name from DB into response body
 * @function
 * @param {Object} req - The HTTP request
 * @param {string} req.params.breed Breed name from query string
 * @param {Object} res - The HTTP response
 * @returns {void} (res is not returned but set.)
 */
exports.breeds_get_breed_by_name = function (req, res) {
  Breed.findOne()
    .byBreed(req.params.breed)
    .then((breed) => {
      // No breed found. Abort
      if (!breed) {
        return res.status(404).send('There are no breed in the database by that name.');
      }
      return res.status(200).json(breed);
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
};

/**
 * get all breeds by egg color
 * Sets response headers and JSON encodes all breeds by egg color from DB into response body
 * @function
 * @param {Object} req - The HTTP request
 * @param {string} req.params.color Egg color from query string
 * @param {Object} res - The HTTP response
 * @returns {void} (res is not returned but set.)
 */
exports.breed_get_breeds_by_egg_color = function (req, res) {
  Breed.find()
    .byEggColor(req.params.color)
    .then((breeds) => {
      // No Breeds Found. Abort
      if (breeds.length === 0) {
        return res
          .status(404)
          .send(`There are no breed in the database by with ${req.params.color} eggs.`);
      }
      return res.status(200).json(breeds);
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
};

/**
 * get all breeds by APA class
 * Sets response headers and JSON encodes all breeds by APA class name from DB into response body
 * @function
 * @param {Object} req - The HTTP request
 * @param {string} req.params.class APA class name from query string
 * @param {Object} res - The HTTP response
 * @returns {void} (res is not returned but set.)
 */
exports.breed_get_breeds_by_class = function (req, res) {
  Breed.find()
    .byApaClass(req.params.class)
    .then((breeds) => {
      // No breeds found. Abort.
      if (breeds.length === 0) {
        return res
          .status(404)
          .send(`There are no breeds of class ${req.params.class} in the database.`);
      }
      return res.status(200).json(breeds);
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
};
