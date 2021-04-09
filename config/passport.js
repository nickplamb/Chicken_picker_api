const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const { User } = require('../models/User.js');

let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, callback) => {
    console.log(email + ' ' + password);
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        console.log(err);
        return callback(err);
      }

      if (!user) {
        console.log('incorrect email');
        return callback(null, false, { message: 'Incorrect email or password.' });
      }

      if (!user.validatePassword(password)) {
        console.log('incorrect password');
        return callback(null, false, { message: 'Incorrect password.' });
      }

      console.log('finished');
      return callback(null, user);
    });
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'hope_frankie_nick-ole',
    },
    (jwtPayload, callback) => {
      return User.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((err) => {
          return callback(err);
        });
    }
  )
);
