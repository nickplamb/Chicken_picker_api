/**
 * Database config
 * @module databaseConfig
 */

const mongoose = require('mongoose');

/**
 * @const host Database host
 */
const host = process.env.CONNECTION_URI || 'mongodb://localhost:27017/chickendb';

/**
 * Database connection
 * @async
 * @function
 */
exports.connectDB = async () => {
  const conn = await mongoose
    .connect(host, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => console.log(`Error while connecting to db: ${err}`));
  console.log(`MongoDB connected: ${conn.connection.host}`);
};
