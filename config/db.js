const mongoose = require('mongoose');
const host = process.env.CONNECTION_URI || 'mongodb://localhost:27017/chickendb';

exports.connectDB = async () => {
  const conn = await mongoose.connect(host, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
};
