import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const breedSchema = new Schema({
  breed: { type: String, required: true },
  description: String,
  eggColor: { type: String, required: true },
  eggSize: String,
  apaClass: { type: String, required: true },
  purpose: String,
  eggProduction: String,
  eggsPerYear: String,
  temperament: String,
  coldTolerance: String,
  heatTolerance: String,
  varieties: [
    {
      variety: String,
      comb: String,
      description: String,
    },
  ],
});

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: Date,
  favoriteBreeds: [{ type: Schema.Types.ObjectId, ref: 'Breeds' }],
  createdAt: { type: Date, default: Date.now },
});
