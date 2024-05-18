const passport = require('passport');
const jwt = require('jsonwebtoken');
const refresh = require('jsonwebtoken-refresh');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
require('dotenv').config();

passport.use('user-login', new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use('admin-login', new LocalStrategy({
  usernameField: 'email', 
  passwordField: 'password',
}, async (email, password, done) => {
  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return done(null, false, { message: 'Incorrect email or password' });
    }

    return done(null, admin);
  } catch (error) {
    return done(error);
  }
}));

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
