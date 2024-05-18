const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://aashutoshag03:EeNywFp4tAHaWC6s@cluster0.ubxkjer.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

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
