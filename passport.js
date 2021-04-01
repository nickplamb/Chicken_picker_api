const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const { Breed } = require('../models/Breed.js');
const { User } = require('../models/User.js');

let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'Username',
      passwordField: 'Password',
    },
    (username, password, callback) => {
      console.log(username + ' ' + password);
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          console.log(err);
          return callback(err);
        }

        if (!user) {
          console.log('incorrect username');
          return callback(null, false, { message: 'Incorrect username or password.' });
        }

        console.log('finished');
        return callback(null, user);
      });
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    },
    (jwtPayload, callback) => {
      return User.findById(jwtPayload.id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);
