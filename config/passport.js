const passport = require('passport');
const jwt = require('jsonwebtoken');
const refresh = require('jsonwebtoken-refresh');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Configure Local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email', // Customize if using a different field for username
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    // Compare password hashes using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Check if password matches
    if (!isPasswordValid) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    // Return the user object
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Configure Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback', // Adjust based on your routes
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists in your database
    let user = await User.findOne({ 'google.id': profile.id });

    if (!user) {
      // If not, create a new user in your database
      const user = new User({
        username: profile.displayName,
        email: profile.emails[0].value,
        google: {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        },
      });
      
      // Exclude the password field for Google-authenticated users
      if (profile.provider === 'google') {
        delete user.password;
      }
      
      await user.save();
    }

    // Return the user to be stored in the session
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}
));

// Serialize user to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
