// controllers/authController.js
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
require('dotenv').config();

const authController = {};

const secretKey = process.env.SECRET;

// Google OAuth login
authController.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] },(req,res) => {
  console.log(req);
});

// Google OAuth callback
authController.googleCallback = passport.authenticate('google', {
  failureRedirect: '/',
  successRedirect: '/dashboard',
});

// Sign-up with Google OAuth
authController.signupWithGoogle = async (req, res) => {
  try {
    const { id, displayName, emails } = req.user._json;
    const email = emails[0].value;

    let user = await User.findOne({ 'google.id': id });

    if (!user) {
      user = new User({
        username: displayName,
        email,
        google: {
          id,
          name: displayName,
          email,
        },
      });

      await user.save();
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

// Local signup
authController.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Ensure the password is present and a string before hashing
    if (!password || typeof password != 'string') {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1h' });

    // Set the token in a cookie
    res.cookie('user_cookie', token, { httpOnly: true });

    // Send a JSON response with user information and token
    return res.json({
      user: {
        username: newUser.username,
        email: newUser.email,
        // Add other user information as needed
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


// Local login
authController.login = async (req, res, next) => {
  try {
    // Use Passport.authenticate middleware for local strategy
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err); // Pass error to Express's error handler
      }

      if (!user) {
        return res.status(401).json({ message: info.message }); // Use message provided by Passport
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      res.cookie('user_cookie', token, { httpOnly: true });
      // **Return the token in the response body as requested:**
      return res.json({ token });


    })(req, res, next); // Call with Express callback pattern
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Logout
authController.logout = (req, res) => {
  res.clearCookie('user_cookie');
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error destroying session' });
    }

    const googleLogoutUrl = 'https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/';
    return res.redirect(googleLogoutUrl);
  });
};

module.exports = authController;
