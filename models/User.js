const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { Breed } = require('../models/Breed');

const bcrypt = require('bcrypt');

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

userSchema.statics.hashPassword = function (password) {
  return bcrypt.hashSync(password, 10);
};

userSchema.query.byUsername = function (username) {
  return this.where({ username: new RegExp(username, 'i') });
};
userSchema.query.byEmail = function (email) {
  return this.where({ email: new RegExp(email, 'i') });
};

// must use standard function declaration so that 'this' references
// the object it was called on instead of the object that owns it.
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports.User = User;
