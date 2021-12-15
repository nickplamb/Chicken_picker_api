/**
 * Express router providing breed related routes
 * @module routers/breeds
 * @requires express
 * @requires passport
 * @requires breedController
 */

const express = require('express');

/**
 * Express router to mount user related functions on.
 */
const router = express.Router();

const breed_controller = require('../controllers/breedController');

const passport = require('passport');
require('../config/passport');

/**
 * Auth middleware
 */
const auth = passport.authenticate('jwt', { session: false });

// Get all chicken breeds
/**
 * Route for /breeds
 * Returns all breeds
 * @name GET/breeds/
 * @memberof module:routers/breeds
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {callback} middleware - Breed controller function
 */
router.get('/', auth, breed_controller.breed_get_all_breeds);

// Get one breed by name
/**
 * Route for /breeds/:params
 * Returns breed whos name was specified in query params
 * @name GET/breeds/:params
 * @memberof module:routers/breeds
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {callback} middleware - Breed controller function
 */
router.get('/:breed', auth, breed_controller.breeds_get_breed_by_name);

// Get all breeds by egg color
/**
 * Route for /breeds/eggs/:params
 * Returns all breeds who lay egg color specified in query params
 * @name GET/breeds/:params
 * @memberof module:routers/breeds
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {callback} middleware - Breed controller function
 */
router.get('/eggs/:color', auth, breed_controller.breed_get_breeds_by_egg_color);

// Get all breeds of specified class
/**
 * Route for /breeds/class/:params
 * Returns all breeds whos class was specified in query params
 * @name GET/breeds/:params
 * @memberof module:routers/breeds
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using JWT supplied in request header
 * @param {callback} middleware - Breed controller function
 */
router.get('/class/:class', auth, breed_controller.breed_get_breeds_by_class);

module.exports = router;
