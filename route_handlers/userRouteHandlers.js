const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('../models.js');

const User = Models.User;

mongoose.connect('mongodb://localhost:27017/chickendb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// const express = require('express');
// const app = express()
// userRoutes.addNewUser
// userRoutes.updateUser
// userRoutes.showFavorites
// userRoutes.addFavorite
// userRoutes.removeFavorite
// userRoutes.deleteUser

module.exports.addNewUser = (req, res) => {
  let newUser = req.body;

  if (!newUser.username) {
    return res.status(400).send('New users require a username. Please try again.');
  }

  newUser.id = uuid.v4();
  users.push(newUser);
  return res.status(201).send(newUser);
};

module.exports.updateUser = (req, res) => {
  let updatedUser = req.body;
  let user = users.find((user) => {
    return user.username.toLowerCase() === req.params.username.toLowerCase();
  });

  if (!user) {
    return res.status(404).send('The user you are trying to update was not found.');
  }

  Object.keys(updatedUser).forEach((key) => {
    user[key] = updatedUser[key];
  });
  console.log(updatedUser);
  console.log(user);
  return res.send(user);
};

module.exports.showFavorites = (req, res) => {
  return res.send(`Here are ${req.params.username}'s favorite breeds.`);
};

module.exports.addFavorite = (req, res) => {
  return res.send(`${req.params.breed} has been added to ${req.params.username}'s favorites.`);
};

module.exports.removeFavorite = (req, res) => {
  return res.send(`${req.params.breed} has been removed from ${req.params.username}'s favorites.`);
};

module.exports.deleteUser = (req, res) => {
  return res.send(`The user ${req.params.username} has been deleted.`);
};
