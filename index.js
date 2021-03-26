// Create the server
const express = require('express');
const app = express();

// Import modules
const morgan = require('morgan');

// Middleware
app.use(morgan('common'));
app.use(express.static('public'));

// Error Handling
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('You done did it. You broke something.');
});

// Data
let topMovies = [
  {
    title: 'Pontypool',
    year: '2008',
    genre: 'horror',
    length: '1h 33min',
    mpaaRating: 'Not Rated',
    director: ['Bruce McDonald'],
    writers: ['Tony Burgess'],
    starring: ['Stephen McHattie', 'Lisa Houle', 'Georgina Reilly'],
    imdbLink: 'https://www.imdb.com/title/tt1226681/',
    imdbRating: '6.6',
  },
  {
    title: 'The Shawshank Redemption',
    year: '1994',
    genre: 'Drama',
    length: '2h 22min',
    mpaaRating: 'R',
    director: ['Frank Darabont'],
    writers: ['Stephen King', 'Frank Darabont'],
    starring: ['Tim Robbins', 'Morgan Freeman'],
    imdbLink: 'https://www.imdb.com/title/tt0111161/',
    imdbRating: '9.3',
  },
  {
    title: 'Moana',
    year: '2016',
    genre: ['Animation', 'Adventure', 'Comedy'],
    length: '1h 47min',
    mpaaRating: 'pg',
    director: ['Ron Clements', 'John Musker'],
    writers: ['Jared Bush', 'Ron Clements'],
    starring: ["Auli'i Cravalho", 'Dwayne Johnson', 'Rachel House'],
    imdbLink: 'https://www.imdb.com/title/tt3521164/',
    imdbRating: '7.6',
  },
  {
    title: 'Parasite',
    year: '2019',
    genre: ['Comedy', 'Drama', 'Thriller'],
    length: '2h 22min',
    mpaaRating: 'R',
    director: 'Bong Joon Ho',
    writers: ['Bong Joon Ho'],
    starring: ['Kang-ho Song', 'Sun-kyun Lee', 'Yeo-jeong Cho'],
    imdbLink: 'https://www.imdb.com/title/tt6751668/',
    imdbRating: '8.6',
  },
  {
    title: 'The Princess Bride',
    year: '1987',
    genre: ['Adventure', 'Family', 'Fantasy'],
    length: '1h 38min',
    mpaaRating: 'PG',
    director: 'Rob Reiner',
    writers: ['William Goldman'],
    starring: ['Cary Elwes', 'Mandy Patinkin', 'Robin Wright'],
    imdbLink: 'https://www.imdb.com/title/tt0093779/',
    imdbRating: '8.0',
  },
  {
    title: 'The Goonies',
    year: '1985',
    genre: ['Adventure', 'Family', 'Comedy'],
    length: '1h 54min',
    mpaaRating: 'PG',
    director: 'Richard Donner',
    writers: ['Chris Columbus', 'Steven Spielberg'],
    starring: ['Sean Astin', 'Josh Brolin', 'Jeff Cohen'],
    imdbLink: 'https://www.imdb.com/title/tt0089218/',
    imdbRating: '7.8',
  },
  {
    title: 'Jumanji: Welcome to the Jungle',
    year: '2017',
    genre: ['Adventure', 'Action', 'Comedy'],
    length: '1h 59min',
    mpaaRating: 'PG-13',
    director: 'Jake Kasden',
    writers: ['Chris Mckenna', 'Eric Sommers'],
    starring: ['Dwayne Johnson', 'Karen Gillan', 'Kevin Hart'],
    imdbLink: 'https://www.imdb.com/title/tt2283362/',
    imdbRating: '6.9',
  },
  {
    title: 'Arrival',
    year: '2016',
    genre: ['Drama', 'Sci-fi'],
    length: '1h 56min',
    mpaaRating: 'PG-13',
    director: 'Denis Villeneuve',
    writers: ['Eric Heisserer', 'Ted Chiang'],
    starring: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker'],
    imdbLink: 'https://www.imdb.com/title/tt2543164/',
    imdbRating: '7.9',
  },
  {
    title: 'Wall-E',
    year: '2008',
    genre: ['Animation', 'Adventure', 'Family'],
    length: '1h 38min',
    mpaaRating: 'G',
    director: 'Andrew Stanton',
    writers: ['Andrew Stanton', 'Pete Docter'],
    starring: ['Ben Burtt', 'Elissa Knight', 'Jeff Garlin'],
    imdbLink: 'https://www.imdb.com/title/tt0910970/',
    imdbRating: '8.4',
  },
  {
    title: 'District 9',
    year: '2009',
    genre: ['Action', 'Sci-fi', 'Thriller'],
    length: '1h 52min',
    mpaaRating: 'R',
    director: 'Neill Blomkamp',
    writers: ['Neill Blomkamp', 'Terri Tatchell'],
    starring: ['Sharlto Copley', 'David James', 'Jason Cope'],
    imdbLink: 'https://www.imdb.com/title/tt1136608/',
    imdbRating: '7.9',
  },
];

// Routes
app.get('/', (req, res) => {
  res.send('Under Construction');
});

app.get('/movies', (req, res) => {
  res.send(topMovies);
  // res.sendFile('top-movies.json', { root: __dirname + '/public' });
});

// Start the server
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
