const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const csurf = require('csurf'); // CSRF protection // need fixtures from front-end part
const helmet = require('helmet'); // Security features // need exploration
const Joi = require('joi'); // Input validation //need fixtures
const rateLimiter = require('./middlewares/rateLimiter'); //working
const { connectToDatabase } = require('./config/database');

// Error handling middleware (add this at the top)
const handleError = (err, req, res, next) => {
  console.error(err.stack); // Log error details for debugging
  res.status(500).json({ message: 'Internal Server Error' });
};

// Initialize Express app
const app = express();

// Helmet for various security features
app.use(helmet());

// JSON parsing
app.use(express.json());

// Cookie parsing with secure options
app.use(cookieParser());

// URL-encoded parsing
app.use(express.urlencoded({ extended: true }));

// Session management with strong secret key and httpOnly flag
app.use(
  session({
    secret: process.env.SECRET || "SECRET", // Replace with strong secret
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true },
  })
);

app.use(rateLimiter);

// CSRF protection middleware
const csrfProtection = csurf({ cookie: true, secret: Buffer.alloc(32) });
// app.use(csrfProtection);


// Passport initialization and session management
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectToDatabase();

// Include routes
const indexRoutes = require('./routes/index');

// Input validation example (assuming a POST route in indexRoutes)
app.post('/submit-data', csrfProtection, async (req, res) => {
  // ... your existing code

  if (!req.csrfToken() || !csrfProtection.verify(req.csrfToken(), req.body._csrf)) {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  // ... remaining code
});

// Route mounting with CSRF protection for forms
app.use('/', indexRoutes);

// Error handling middleware (place at the bottom)
app.use(handleError);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
