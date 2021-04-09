// Models
const { Breed } = require('../models/Breed.js');

// DB connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/chickendb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get all chicken breeds
exports.breed_get_all_breeds = function (req, res) {
  Breed.find()
    .then((breeds) => {
      return res.status(200).json(breeds);
    })
    .catch((err) => {
      return res.status(500).send(`Something went wrong. Error: ${err}.`);
    });
};

// Get one breed by name
exports.breeds_get_breed_by_name = function (req, res) {
  Breed.findByBreed(req.params.breed)
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

// Get all breeds by egg color
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

// Get all breeds of specified class
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
