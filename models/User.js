const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const User = mongoose.model('User', userSchema);
module.exports.User = User;
