const express = require('express');
const router = express.Router();

//Controllers
const user_controller = require('../controllers/usersController');

// Route Authentication
const passport = require('passport');
require('../passport');
const auth = passport.authenticate('jwt', { session: false });

// Input validation rules
const { check } = require('express-validator');
const newUserValidation = [
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
const updateUserValidation = [
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
router.get('/', auth, user_controller.user_get_all);
// FOR DEV ONLY!^^^^^^^^^^^^^^^^^^^^^^^^^^^

// Create new user
router.post('/', newUserValidation, user_controller.user_post_new_user);

// Update existing user by _id in JWT token
router.put('/', auth, updateUserValidation, user_controller.user_put_user_update);

// Get list of users favorite breeds by _id in JWT token
router.get('/favorites', auth, user_controller.user_get_favorites);

// Add breed to users favorite list
router.post('/favorites/:breedName', auth, user_controller.user_post_new_favorite);

// Remove a breed from users favorite list
router.delete('/favorites/:breedId', auth, user_controller.user_delete_user_favorite);

// Delete the User account.
router.delete('/', auth, user_controller.user_delete_account);

module.exports = router;
