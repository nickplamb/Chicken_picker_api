/**
 * User Controller module
 * @module usersConstroller
 * @requires Breed
 * @requires User
 * @requires express-validator
 */

// Models
const { Breed } = require('../models/Breed.js');
const { User } = require('../models/User.js');

// Validation
const { check, validationResult } = require('express-validator');

// FOR DEV ONLY!
// RETURNS ALL USERS
// exports.user_get_all = function (req, res) {
//   User.find()
//     .then((users) => {
//       return res.status(201).json(users);
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).send(`something went wrong. Error: ${err}.`);
//     });
// };

/**
 * Creates a new user
 * Sets response headers and JSON encodes new user into response body
 * @function
 * @param {Object} req The HTTP request
 * @param {Object} res The HTTP response
 * @returns {void}
 */
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

/**
 * Updates an exists user
 * Sets response headers and JSON encodes the new user data in response body
 * @function
 * @param {Object} req The HTTP request
 * @param {string} req.user._id User ID decrypted from JWT token
 * @param {Object} res The HTTP response
 * @returns {void}
 */
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

/**
 * Sends list of users favorite breed ID's
 * sets response headers and JSON encodes array of user favorite breed ID's into the response body
 * @function
 * @param {Object} req - The HTTP request
 * @param {string} req.user._id User ID decrypted from JWT token
 * @param {Object} res - The http response
 * @returns {void}
 */
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

/**
 * Adds a breed to the users favorites array
 * Sets response headers and JSON encodes the updated array of user favorite breed ID's
 * @function
 * @param {Object} req - The HTTP request
 * @param {string} req.user._id User ID decrypted from JWT token
 * @param {string} req.params.breedId Breed ID from query string
 * @param {Object} res - The http response
 * @returns {void}
 */
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

/**
 * Deletes a breed to the users favorites array
 * Sets response headers and JSON encodes the updated array of user favorite breed ID's
 * @function
 * @param {Object} req - The HTTP request
 * @param {string} req.user._id User ID decrypted from JWT token
 * @param {string} req.params.breedId Breed ID from query string
 * @param {Object} res - The http response
 * @returns {void}
 */
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

/**
 * Deletes a users records from the DB
 * @function
 * @param {Object} req - The HTTP request
 * @param {string} req.user._id User ID decrypted from JWT token
 * @param {Object} res - The http response
 * @returns {void}
 */
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

// /**
//  * New user validation rules
//  */
// exports.newUserValidation = [
//   check('username', 'Username is required and must be at least 5 characters long').isLength({
//     min: 5,
//   }),
//   check('username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
//   check('password', 'Password is required and must be at least 10 characters long').isLength({
//     min: 10,
//   }),
//   check('email', 'Email does not appear to be valid').isEmail().normalizeEmail(),
//   check('birthday').optional().toDate(),
// ];

// /**
//  * Update user validation rules
//  */
// exports.updateUserValidation = [
//   check('username', 'Username is required and must be at least 5 characters long')
//     .isLength({ min: 5 })
//     .optional(),
//   check('username', 'Username contains non alphanumeric characters - not allowed')
//     .isAlphanumeric()
//     .optional(),
//   check('password', 'Password is required and must be at least 10 characters long')
//     .isLength({ min: 10 })
//     .optional(),
//   check('email', 'Email does not appear to be valid').isEmail().normalizeEmail().optional(),
//   check('birthday').optional().toDate().optional(),
// ];
