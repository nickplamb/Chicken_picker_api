const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const passport = require('passport');
require('../passport');

const { Breed } = require('../models/Breed.js');
const { User } = require('../models/User.js');

mongoose.connect('mongodb://localhost:27017/chickendb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let auth = passport.authenticate('jwt', { session: false });

// FOR DEV ONLY!
// RETURNS ALL USERS
router.get('/', auth, (req, res) => {
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

// Create new user
router.post('/', (req, res) => {
  // Check for existing user by the username in the body
  User.findOne({ username: req.body.username }).then((user) => {
    // if user already exist return with response.
    if (user) {
      return res.status(409).send(`${req.body.username} already exists.`);
    }

    // otherwise, create the new user.
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
  });
});

// Update existing user
router.put('/:username', auth, (req, res) => {
  let reqUser = req.body;

  //Find user by username
  User.findOne({ username: req.params.username })
    .then((user) => {
      // If user found, Abort.
      if (!user) {
        return res.status(404).send(`The user was not found. Please try again.`);
      }

      // Only update properties passed
      Object.keys(reqUser).forEach((key) => {
        user[key] = reqUser[key];
      });

      // save the user
      user
        .save()
        .then((updatedUser) => {
          return res.status(200).json(updatedUser);
        })
        .catch((err) => {
          return res.status(500).send(`Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(500).send(`An error occurred. Error: ${err}`);
    });
});

// Get list of users favorite breeds
router.get('/:username/favorites', auth, (req, res) => {
  User.findOne({ username: req.params.username })
    .populate('favoriteBreeds')
    .then((user) => {
      // User not found, Abort.
      if (!user) {
        return res.status(404).send('The user was not found. Please try again.');
      }

      return res.status(200).json(user.favoriteBreeds);
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
});

// Add breed to users favorite list
router.post('/:username/favorites/:breedName', auth, (req, res) => {
  // Find the User
  User.findOne({ username: req.params.username })
    .then((user) => {
      // User doesn't exist. Abort.
      if (!user) {
        return res.status(404).send('User not found. Please try again.');
      }
      // Find the breed.
      Breed.findOne({ breed: req.params.breedName })
        .then((breed) => {
          // Breed not found. Abort.
          if (!breed) {
            return res.status(404).send('Breed not found. Please try again.');
          }
          // Check that the breed is not already in the favorites list.
          if (user.favoriteBreeds.includes(breed._id)) {
            return res.status(409).send(`${breed.breed} is already one of your favorites.`);
          }
          // Add breed to users favorite list
          user.favoriteBreeds.push(breed._id);
          user
            .save()
            .then((savedUser) => {
              // Populate breed info to be sent back.
              User.populate(savedUser, [{ path: 'favoriteBreeds' }], (err, user) => {
                return res.status(200).json(user.favoriteBreeds);
              });
            })
            .catch((err) => {
              return res.status(500).send(`Couldn't save. Something went wrong. ${err}`);
            });
        })
        .catch((err) => {
          return res.status(500).send(`Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
});

// Remove a breed from users favorite list
router.delete('/:username/favorites/:breedId', auth, (req, res) => {
  // Find the user.
  User.findOne({ username: req.params.username }).then((user) => {
    // User doesn't exist. Abort.
    if (!user) {
      return res.status(404).send('User not found. Please try again.');
    }
    // Breed is not in favorite list.
    if (!user.favoriteBreeds.includes(req.params.breedId)) {
      return res.status(404).send(`This breed was not one of your favorites.`);
    }
    // Remove the breed from favorite list.
    user.favoriteBreeds.pull(req.params.breedId);
    user
      .save()
      .then((savedUser) => {
        // Populate breed info to be sent back.
        User.populate(savedUser, [{ path: 'favoriteBreeds' }], (err, user) => {
          return res.status(200).json(user.favoriteBreeds);
        });
      })
      .catch((err) => {
        return res.status(404).send(`Error: ${err}`);
      });
  });
});

// Delete the User account.
router.delete('/:username', auth, (req, res) => {
  // Find the user.
  User.findOneAndDelete({ username: req.params.username })
    .then((user) => {
      // User not found. Abort.
      if (!user) {
        return res.status(404).send(`${req.params.username} was not found.`);
      }
      // User has been deleted
      return res.status(200).send(`${req.params.username} has been deleted.`);
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
});

module.exports = router;
