const express = require('express');
const router = express.Router();

//Authentication
const passport = require('passport');
require('../config/passport');
let auth = passport.authenticate('jwt', { session: false });

//Controller
const breed_controller = require('../controllers/breedController');

// Get all chicken breeds
router.get('/', auth, breed_controller.breed_get_all_breeds);

// Get one breed by name
router.get('/:breed', auth, breed_controller.breeds_get_breed_by_name);

// Get all breeds by egg color
router.get('/eggs/:color', auth, breed_controller.breed_get_breeds_by_egg_color);

// Get all breeds of specified class
router.get('/class/:class', auth, breed_controller.breed_get_breeds_by_class);

module.exports = router;
