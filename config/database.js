const mongoose = require('mongoose');
require('dotenv').config()

const mongoURI = process.env.MONGO_URI;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if unable to connect to MongoDB
  }
};

module.exports = { connectToDatabase };
