const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');

const userSchema = Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    birthday: Date,
    favoriteBreeds: [{ type: Schema.Types.ObjectId, ref: 'Breed' }],
  },
  { timestamps: true }
);

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

// must use standard function declaration so that 'this' references
// the object it was called on instead of the object that owns it.
userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports.User = User;
