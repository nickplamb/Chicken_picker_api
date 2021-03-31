// Create the server
const express = require('express');
const app = express();

// Import modules
const morgan = require('morgan');

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
let breeds = require('./routes/breeds.js');
app.use('/breeds', breeds);

// User Routes
let users = require('./routes/users.js');
app.use('/users', users);

// Start the server
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
