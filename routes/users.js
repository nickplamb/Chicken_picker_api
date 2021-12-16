/**
 * Express router providing user related routes
 * @module routers/users
 * @requires express
 * @requires passport
 * @requires usersController
 */
//https://stackoverflow.com/questions/31818538/jsdocs-documenting-node-js-express-routes

const express = require('express');

/**
 * Express router to mount user related functions on.
 */
const router = express.Router();

const user_controller = require('../controllers/usersController');
const passport = require('passport');
require('../config/passport');

/**
 * Auth middleware
 */
const auth = passport.authenticate('jwt', { session: false });

// FOR DEV ONLY!
// RETURNS ALL USERS
// router.get('/', auth, user_controller.user_get_all);

// Create new user
/**
 * Route for POST to /users
 * saves new user in the database and returns that user
 * @name POST/users/
 * @memberof module:routers/users
 * @param {string} path - Express route
 * @param {Array} middleware - Validation rules for new user
 * @param {callback} middleware - User controller function
 */
router.post('/', user_controller.newUserValidation, user_controller.user_post_new_user);

// Update existing user by _id in JWT token
/**
 * Route for put /users
 * Updates users data in the database and returns updated user data
 * @name PUT/users
 * @memberof module:routers/users
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {Array} middleware - Validation rules for updating user data
 * @param {callback} middleware - User controller function
 */
router.put('/', auth, user_controller.updateUserValidation, user_controller.user_put_user_update);

// Get list of users favorite breeds by _id in JWT token
/**
 * Route for GET to /users
 * Returns array of users favorite breed IDs
 * @name GET/users/favorites
 * @memberof module:routers/users
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {callback} middleware - User controller function
 */
router.get('/favorites', auth, user_controller.user_get_favorites);

// Add breed to users favorite list
/**
 * Route for POST to /users/favorites/:params
 * Saves specified breed in users favorites array and returns array of users favorite breed IDs
 * @name POST/users/favorites/:params
 * @memberof module:routers/users
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {callback} middleware - User controller function
 */
router.post('/favorites/:breedId', auth, user_controller.user_post_new_favorite);

// Remove a breed from users favorite list
/**
 * Route for DELETE to /users/favorites/:params
 * Deletes specified breed from users favorites array and returns array of users favorite breed IDs
 * @name DELETE/users/favorites/:params
 * @memberof module:routers/users
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {callback} middleware - User controller function
 */
router.delete('/favorites/:breedId', auth, user_controller.user_delete_user_favorite);

// Delete the User account.
/**
 * Route for Delete to /users
 * Deletes the user from the database and returns message confirming deletion
 * @name DELETE/users
 * @memberof module:routers/users
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {callback} middleware - User controller function
 */
router.delete('/', auth, user_controller.user_delete_account);

module.exports = router;
