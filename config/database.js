const mongoose = require('mongoose');

// Replace 'your_database_url' with your actual MongoDB connection string
const mongoURI = 'mongodb+srv://aashutoshag03:EeNywFp4tAHaWC6s@cluster0.ubxkjer.mongodb.net/test?retryWrites=true&w=majority';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,

    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if unable to connect to MongoDB
  }
};

module.exports = { connectToDatabase };
