/**
 * User Model
 * @module userModel
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Breed } = require('../models/Breed');

const bcrypt = require('bcrypt');

/**
 * User Schema
 */
const userSchema = Schema(
  {
    _id: { type: Schema.ObjectId, auto: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    birthday: Date,
    favoriteBreeds: [{ type: Schema.Types.ObjectId, ref: 'Breed' }],
  },
  { timestamps: true }
);

/**
 * Static method on the user model used to salt and hash the password before storing it in the DB.
 * @memberof module:userModel~User
 * @param {string} password Password passed from the user registration route.
 * @returns {string} Salted and hashed password.
 */
userSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

/**
 * Query helper to return a user by username.
 * @alias byUsername
 * @memberof! module:userModel~User
 * @instance
 * @param {string} username Username.
 * @returns {object} Query class instance with found document.
 * @example User.findOne().byUsername("username")
 */
userSchema.query.byUsername = function (username) {
  return this.where({ username: new RegExp(username, 'i') });
};

/**
 * Query helper to return a user by email address.
 * @alias byEmail
 * @memberof! module:userModel~User
 * @instance
 * @param {string} email Users email address.
 * @returns {object} Query class instance with found document.
 * @example User.findOne().byEmail("email address")
 */
userSchema.query.byEmail = function (email) {
  return this.where({ email: new RegExp(email, 'i') });
};

// must use standard function declaration so that 'this' references
// the object it was called on instead of the object that owns it.
/**
 * Instance method that salts and hashes thepassword from login route and compares it to the password stored in the DB.
 * @alias validatePassword
 * @memberof! module:userModel~User
 * @instance
 * @param {string} password Password passed from the user login route
 * @returns {boolean}
 * @example if(User.validatePassword("password")) {
 *  ...
 * }
 */
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * User model
 * @class User
 */
const User = mongoose.model('User', userSchema);

module.exports.User = User;
