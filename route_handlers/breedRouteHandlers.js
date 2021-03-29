const mongoose = require('mongoose');
const Models = require('../models.js');

const Breed = Models.Breed;

// breedRoutes.breeds,
// breedRoutes.breedByName
// breedRoutes.eggColor
// breedRoutes.apaClass

module.exports.breeds = (req, res) => {
  return res.send(chickenBreeds);
};

module.exports.breedByName = (req, res) => {
  let breed = chickenBreeds.find((breed) => {
    return breed.name.toLowerCase() === req.params.breed.toLowerCase();
  });

  if (!breed) {
    return res.status(404).send(`There is no ${req.params.breed} breed in the database.`);
  }

  return res.send(breed);
};

module.exports.eggColor = (req, res) => {
  let breeds = chickenBreeds.filter((breed) => {
    return breed.egg.color.toLowerCase() === req.params.color.toLowerCase();
  });

  if (!breeds.length) {
    return res.status(404).send(`There are no breeds with ${req.params.color} colored eggs.`);
  }

  return res.send(breeds);
};

module.exports.apaClass = (req, res) => {
  let breeds = chickenBreeds.filter((breed) => {
    return breed.apaclass.toLowerCase() === req.params.class.toLowerCase();
  });

  if (!breeds.length) {
    return res
      .status(404)
      .send(`There are no breeds of class ${req.params.class} in the database.`);
  }

  return res.send(breeds);
};
