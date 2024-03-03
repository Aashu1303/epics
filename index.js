const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const indexRoutes = require('./routes/index');
const { connectToDatabase } = require('./config/database');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(cors());

app.use(express.json());

// Set up middleware
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'your_session_secret', // Replace with a strong session secret
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectToDatabase();

// Include routes
app.use('/', indexRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
