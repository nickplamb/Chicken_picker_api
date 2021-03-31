const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Breed } = require('../models/Breed.js');
const { User } = require('../models/User.js');

// const User = Models.User;

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

router.get('/:username/favorites', (req, res) => {
  User.findOne({ username: req.params.username })
    .populate('favoriteBreeds')
    .then((user) => {
      return res.status(200).json(user.favoriteBreeds);
    });
});

router.post('/:username/favorites/:breedName', (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('User not found. Please try again.');
      }
      Breed.findOne({ breed: req.params.breedName })
        .then((breed) => {
          if (!breed) {
            return res.status(404).send('Breed not found. Please try again.');
          }
          if (user.favoriteBreeds.includes(breed._id)) {
            return res.status(409).send(`${breed.breed} is already one of your favorites.`);
          }
          user.favoriteBreeds.push(breed._id);
          user
            .save()
            .then((savedUser) => {
              User.populate(savedUser, [{ path: 'favoriteBreeds' }], (err, user) => {
                return res.status(201).json(user.favoriteBreeds);
              });
            })
            .catch((err) => {
              return res.status(500).send(`Couldn't save. Something went wrong. ${err}`);
            });
        })
        .catch((err) => {
          return res.status(404).send(`Error: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(404).send(`Error: ${err}`);
    });
});

router.delete('/:username/favorites/:breedId', (req, res) => {
  User.findOne({ username: req.params.username }).then((user) => {
    if (!user) {
      return res.status(404).send('User not found. Please try again.');
    }
    if (!user.favoriteBreeds.includes(req.params.breedId)) {
      return res.status(404).send(`This breed was not one of your favorites.`);
    }
    user.favoriteBreeds.pull(req.params.breedId);
    user
      .save()
      .then((savedUser) => {
        User.populate(savedUser, [{ path: 'favoriteBreeds' }], (err, user) => {
          return res.status(201).json(user.favoriteBreeds);
        });
      })
      .catch((err) => {
        return res.status(404).send(`Error: ${err}`);
      });
  });
});

router.deleteUser = (req, res) => {
  return res.send(`The user ${req.params.username} has been deleted.`);
};

module.exports = router;
