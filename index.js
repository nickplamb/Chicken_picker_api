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
app.get('/breeds', (req, res) => breedRoutes.breeds(req, res));
app.get('/breeds/:breed', (req, res) => breedRoutes.breedByName(req, res));
app.get('/breeds/eggs/:color', (req, res) => breedRoutes.eggColor(req, res));
app.get('/breeds/class/:class', (req, res) => breedRoutes.apaClass(req, res));

// User Routes
app.post('/users', (req, res) => userRoutes.addNewUser(req, res));
app.put('/users/:username', (req, res) => userRoutes.updateUser(req, res));
app.get('/users/:username/favorites', (req, res) => userRoutes.showFavorites(req, res));
app.post('/users/:username/favorites/:breed', (req, res) => userRoutes.addFavorite(req, res));
app.delete('/users/:username/favorites/:breed', (req, res) => userRoutes.removeFavorite(req, res));
app.delete('/users/:username', (req, res) => userRoutes.deleteUser(req, res));

// Start the server
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
