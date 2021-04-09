const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const jwtSecret = 'hope_frankie_nick-ole';

require('../config/passport.js');

let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

// Route for initial Login to /login/
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
