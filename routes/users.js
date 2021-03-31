const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Models = require('../models/User.js');
const { route } = require('./breeds.js');

const User = Models.User;

mongoose.connect('mongodb://localhost:27017/chickendb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// app.post('/users', userRoutes.addNewUser);
// app.put('/users/:username', userRoutes.updateUser);
// app.get('/users/:username/favorites', userRoutes.showFavorites);
// app.post('/users/:username/favorites/:breed', userRoutes.addFavorite);
// app.delete('/users/:username/favorites/:breed', userRoutes.removeFavorite);
// app.delete('/users/:username', userRoutes.deleteUser);

// FOR DEV ONLY!
// RETURNS ALL USERS
router.get('/', (req, res) => {
  User.find()
    .then((users) => {
      return res.status(201).json(users);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(`something went wrong. Error: ${err}.`);
    });
});
// FOR DEV ONLY!

router.post('/', (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (!user) {
      User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday,
      })
        .then((user) => {
          return res.status(201).json(user);
        })
        .catch((err) => {
          return res.status(500).send(`Error: ${err}`);
        });
    } else {
      return res.status(400).send(`${req.body.username} already exists.`);
    }
  });
});

router.put('/:username', (req, res) => {
  let reqUser = req.body;
  User.findOne({ username: req.params.username })
    .then((user) => {
      Object.keys(reqUser).forEach((key) => {
        user[key] = reqUser[key];
      });
      user
        .save()
        .then((updatedUser) => {
          return res.status(200).json(updatedUser);
        })
        .catch((err) => {
          return res.status(404).send(`The user was not found. Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(500).send(`An error occurred. Error: ${err}`);
    });
});

router.showFavorites = (req, res) => {
  return res.send(`Here are ${req.params.username}'s favorite breeds.`);
};

router.addFavorite = (req, res) => {
  return res.send(`${req.params.breed} has been added to ${req.params.username}'s favorites.`);
};

router.removeFavorite = (req, res) => {
  return res.send(`${req.params.breed} has been removed from ${req.params.username}'s favorites.`);
};

router.deleteUser = (req, res) => {
  return res.send(`The user ${req.params.username} has been deleted.`);
};

module.exports = router;
