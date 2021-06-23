// Models
const { Breed } = require('../models/Breed.js');
const { User } = require('../models/User.js');

// Input validation rules
const { check, validationResult } = require('express-validator');
let newUserValidation = [
  check('username', 'Username is required and must be at least 5 characters long').isLength({
    min: 5,
  }),
  check('username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
  check('password', 'Password is required and must be at least 10 characters long').isLength({
    min: 10,
  }),
  check('email', 'Email does not appear to be valid').isEmail().normalizeEmail(),
  check('birthday').optional().toDate(),
];
let updateUserValidation = [
  check('username', 'Username is required and must be at least 5 characters long')
    .isLength({ min: 5 })
    .optional(),
  check('username', 'Username contains non alphanumeric characters - not allowed')
    .isAlphanumeric()
    .optional(),
  check('password', 'Password is required and must be at least 10 characters long')
    .isLength({ min: 10 })
    .optional(),
  check('email', 'Email does not appear to be valid').isEmail().normalizeEmail().optional(),
  check('birthday').optional().toDate().optional(),
];

// FOR DEV ONLY!
// RETURNS ALL USERS
exports.user_get_all = function (req, res) {
  User.find()
    .then((users) => {
      return res.status(201).json(users);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send(`something went wrong. Error: ${err}.`);
    });
};

// Create new user
exports.user_post_new_user = function (req, res) {
  // Validate user inputs
  let validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ errors: validationErrors.array() });
  }

  // Has the password
  let hashedPassword = User.hashPassword(req.body.password);

  // Check for existing user by the username in the body
  User.findOne()
    .byEmail(req.body.email)
    .then((user) => {
      // if user already exist return with response.
      if (user) {
        return res.status(409).send(`The email address ${req.body.email} is already registered.`);
      }

      // otherwise, create the new user.
      User.create({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        birthday: req.body.birthday,
      })
        .then((user) => {
          return res.status(201).json(user);
        })
        .catch((err) => {
          return res.status(500).send(`Error: ${err}`);
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).send(`Error: ${err}`);
    });
};

// Update existing user by _id in JWT token
exports.user_put_user_update = function (req, res) {
  let reqUser = req.body;

  //Find user by username decrypted from JWT token
  User.findById(req.user._id)
    .then((user) => {
      // If user found, Abort.
      if (!user) {
        return res.status(404).send(`The user was not found. Please try again.`);
      }

      // Only update properties passed
      Object.keys(reqUser).forEach((key) => {
        switch (key) {
          case 'password':
            user.password = User.hashPassword(reqUser.password);
            break;
          case 'username':
            user.username = reqUser.username;
            break;
          case 'birthday':
            user.birthday = reqUser.birthday;
          default:
            break;
        }
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
};

// Get list of users favorite breeds by _id in JWT token
exports.user_get_favorites = function (req, res) {
  User.findById(req.user._id)
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
};

// Add breed to users favorite list
exports.user_post_new_favorite = function (req, res) {
  // Find the User
  User.findById(req.user._id)
    .then((user) => {
      // User doesn't exist. Abort.
      if (!user) {
        return res.status(404).send('User not found. Please try again.');
      }
      // Find the breed.
      // Breed.findOne().byBreed(req.params.breedName)
      Breed.findById(req.params.breedId)
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
          return res.status(500).send(`Error here?: ${err}`);
        });
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
};

// Remove a breed from users favorite list
exports.user_delete_user_favorite = function (req, res) {
  // Find the user.
  User.findById(req.user._id).then((user) => {
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
};

// Delete the User account.
exports.user_delete_account = function (req, res) {
  // Find the user.
  User.findByIdAndDelete(req.user._id)
    .then((user) => {
      // User not found. Abort.
      if (!user) {
        return res.status(404).send(`${req.user.username} was not found.`);
      }
      // User has been deleted
      return res.status(200).send(`${req.user.username} has been deleted.`);
    })
    .catch((err) => {
      return res.status(500).send(`Error: ${err}`);
    });
};
