const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const passport = require('passport');
require('../passport');

const { Breed } = require('../models/Breed.js');

let auth = passport.authenticate('jwt', { session: false });

// Get all chicken breeds
router.get('/', auth, (req, res) => {
  Breed.find()
    .then((breeds) => {
      return res.status(200).json(breeds);
    })
    .catch((err) => {
      return res.status(500).send(`Something went wrong. Error: ${err}.`);
    });
});

// Get one breed by name
router.get('/:breed', auth, (req, res) => {
  Breed.findOne({ breed: req.params.breed })
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
});

// Get all breeds by egg color
router.get('/eggs/:color', auth, (req, res) => {
  Breed.find({ eggColor: req.params.color.toLowerCase() })
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
});

// Get all breeds of specified class
router.get('/class/:class', auth, (req, res) => {
  Breed.find({ apaClass: req.params.class })
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
});

module.exports = router;
