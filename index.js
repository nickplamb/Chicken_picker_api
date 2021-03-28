// Create the server
const express = require('express');
const app = express();

// Import modules
const morgan = require('morgan');

// Import Routes
const breedRoutes = require('./route_handlers/breedRouteHandlers.js');
// breedRoutes.breeds,
// breedRoutes.breedByName
// breedRoutes.eggColor
// breedRoutes.apaClass

const userRoutes = require('./route_handlers/userRouteHandlers.js');
// userRoutes.addNewUser
// userRoutes.updateUser
// userRoutes.showFavorites
// userRoutes.addFavorite
// userRoutes.removeFavorite
// userRoutes.deleteUser

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());

// Error Handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('You done did it. You broke something.');
});

// Routes
// Breed Routes
// app.get('/breeds', (req, res) => breedRoutes.breeds(req, res));
app.get('/breeds', breedRoutes.breeds);
app.get('/breeds/:breed', breedRoutes.breedByName);
app.get('/breeds/eggs/:color', breedRoutes.eggColor);
app.get('/breeds/class/:class', breedRoutes.apaClass);

// User Routes
app.post('/users', userRoutes.addNewUser);
app.put('/users/:username', userRoutes.updateUser);
app.get('/users/:username/favorites', userRoutes.showFavorites);
app.post('/users/:username/favorites/:breed', userRoutes.addFavorite);
app.delete('/users/:username/favorites/:breed', userRoutes.removeFavorite);
app.delete('/users/:username', userRoutes.deleteUser);

// Start the server
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
