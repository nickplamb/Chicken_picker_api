/**
 * Auth route for initial login
 * @module routers/auth
 * @requires express
 * @requires jsonwebtoken
 * @requires passport
 */
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const jwtSecret = 'hope_frankie_nick-ole';

require('../config/passport.js');

/**
 * Create the JWT to be passed to client for authorization
 * @memberof module:routers/auth
 * @function
 * @param {object} user The user object retrieved from the DB
 * @returns {string} Newely created JWT
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d', // '30m (m, h, hrs, hours, d, days, y)
    algorithm: 'HS256',
  });
};

/**
 * Route for initial Login to /login
 * @name POST/login
 * @param {string} path - Express route
 * @param {callback} middleware - Authenticates the user using passport local strategy
 */
router.post('/', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Something is not right', user: user });
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      let token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = router;
