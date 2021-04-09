const mongoose = require('mongoose');
const host = 'mongodb://localhost:27017/chickendb';

const connectDB = async () => {
  const conn = await mongoose.connect(host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
};

module.exports = connectDB;
