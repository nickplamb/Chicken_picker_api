# Chickens_API

An API that serves up information about different chicken breeds to help backyard chicken parents pick their favorites.

## App Description

The API uses MongoDB hosted on [MongoDB Atlas](mongodb.com/cloud/atlas) and an [Express.js](expressjs.com/) server hosted on [Heroku](Heroku.com)

## Concepts learned

- Node.js and NPM
- REST APIs
- Testing with Postman
- CRUD operations
- Relational and non-relational databases
- SQL, ODMs, models, schemas, database keys
- Authentication and authorization strategies
- Data security and privacy
- Code documentation

## Technologies

This API was built with the following libraries:

- Express.js
- Mongoose
- Morgan
- Passport
- Bcrypt
- Jsonwebtoken
- Jsdoc

## Documentation

See [endpoint documentation](https://chickens-api.herokuapp.com/) for all endpoints.

See [api documentation](https://chickens-api.herokuapp.com/docs) for the docs.

## Future Development

- [ ] Allow user submissions of breeds and breed data
  - Allow users to submit data, hold the data for review before merging with main db.
- [ ] Email functionality
  - Send verification emails to newly registered users
  - Send automated emails to users when their favorite breeds have updates, etc.
- [ ] Add photo credits to breed model
  - Include links on the photos to the origional source of the photos.
- [ ] Clear up email/username confusion
  - Currently email addresses are used for login and must be unique. Password managers try to save usernames instead of email address'.
  - Might be as simple as labeling username inputs as text instead of username.
  - Email address was used as login to keep each user unique and prevent serving the wrong users data up.
- [ ] Improve UI/UX and overall look.
