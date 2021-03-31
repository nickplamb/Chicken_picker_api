const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Models = require('../models/Breed.js');

const Breed = Models.Breed;

// app.get('/breeds', breedRoutes.breeds);
// app.get('/breeds/:breed', breedRoutes.breedByName);
// app.get('/breeds/eggs/:color', breedRoutes.eggColor);
// app.get('/breeds/class/:class', breedRoutes.apaClass);

// Handler for GET /breeds
/*
 * @params request, response
 */
router.get('/', (req, res) => {
  Breed.find()
    .then((breeds) => {
      return res.json(breeds);
    })
    .catch((err) => {
      return res.status(500).send(`Something went wrong. Error: ${err}.`);
    });
});

// Handler for GET /breeds/:breed
/*
 * CASE SENSITIVE
 * @params req.params.breed
 */
router.get('/:breed', (req, res) => {
  Breed.findOne({ breed: req.params.breed })
    .then((breed) => {
      if (!breed) {
        return res.status(404).send('There are no breed in the database by that name.');
      }
      return res.status(200).json(breed);
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
});

// Handler for GET /breeds/eggs/:color
/*
 * @params req.params.color
 */
router.get('/eggs/:color', (req, res) => {
  Breed.find({ eggColor: req.params.color.toLowerCase() })
    .then((breeds) => {
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
});

// Handler for GET /breeds/class/:class
/*
 * @params req.params.class
 */
router.get('/class/:class', (req, res) => {
  Breed.find({ apaClass: req.params.class })
    .then((breeds) => {
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
});

module.exports = router;
