// controllers/authController.js
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Admin = require('../models/Admin');
const categories = require('../utils/categories')
require('dotenv').config();

const authController = {};
const secretKey = process.env.SECRET;

// Local signup
authController.signup = async (req, res) => {
  try {
    const { username, email, password, contact, room } = req.body;
    // Check if the email is already registered
    if (!username || !email || !contact || !password || !room) {
      return res.status(500).json({ message: "missing fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    // console.log(username, email, password, contact)
    if (!password || typeof password != 'string') {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      contact,
      room,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: '1d' });

    return res.status(200).json({
      user: {
        username: newUser.username,
        email: newUser.email,
        contact,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

authController.adminSignup = async (req, res) => {
  try {
    const { username, email, password, contact } = req.body;
    if (!username || !email || !contact || !password) {
      return res.status(500).json({ message: "missing fields" });
    }
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    if (typeof password != 'string') {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      contact,
      categories,
    });

    await newAdmin.save();

    const token = jwt.sign({ userId: newAdmin._id }, secretKey, { expiresIn: '1d' });

    return res.status(200).json({
      admin: {
        username: newAdmin.username,
        email: newAdmin.email,
        contact,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

authController.login = async (req, res, next) => {
  try {
    passport.authenticate('user-login', (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      // console.log(user)
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1d' });

      return res.status(201).json({ token });
    })(req, res, next);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
authController.adminLogin = async (req, res, next) => {
  try {
    passport.authenticate('admin-login', (err, admin, info) => {
      if (err) {
        return next(err);
      }

      if (!admin) {
        return res.status(401).json({ message: info.message });
      }

      const token = jwt.sign({ userId: admin._id }, secretKey, { expiresIn: '1d' });

      return res.status(201).json({ token });
    })(req, res, next);
  } catch (error) {
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
