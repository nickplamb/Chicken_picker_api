/**
 * Express App
 * @module app
 * @requires express
 * @requires morgan
 * @requires cors
 * @requires connectDB
 */
// Create the server
const express = require('express');
const app = express();

/**
 * Server port number
 * @const
 */
const port = process.env.PORT || 8080;

// Import modules
const morgan = require('morgan');
const cors = require('cors');

// authentication
require('./config/passport');

//DB connection
const { connectDB } = require('./config/db');
connectDB();

let allowedOrigins = ['*', 'http://localhost:8080', 'http://localhost:1234'];

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));
app.use(express.json());

// CORS handling
app.use(cors());
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin) return callback(null, true);
//       //if origin is not found
//       if (allowedOrigins.indexOf(origin === -1)) {
//         let message = `The CORS policy for this application doesn't allow access from origin ${origin}`;
//         return callback(new Error(message), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

// Error Handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('You done did it. You broke something.');
});

// Routes
/**
 * Route serving root enpoint. Sends /public/documentation.html.
 * @alias Get/
 * @memberof! module:app
 */
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/documentation.html');
});

/**
 * Auth router.
 * see {@link module:routers/auth}
 * @alias authRouter
 * @memberof module:app
 */
let auth = require('./routes/auth.js');
app.use('/login', auth);

/**
 * Breeds router.
 * see {@link module:routers/breeds}
 * @alias breedsRouter
 * @memberof module:app
 */
let breeds = require('./routes/breeds.js');
app.use('/breeds', breeds);

/**
 * Users router.
 * see {@link module:routers/users}
 * @alias userRouter
 * @memberof module:app
 */
let users = require('./routes/users.js');
app.use('/users', users);

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Your app is listening on port ${port}.`);
});
