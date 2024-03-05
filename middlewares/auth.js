const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET;

function verifyJWT(req, res, next) {
  const token = req.cookies['user_cookie'];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing JWT token' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.userId; 
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: 'Unauthorized: Invalid JWT token' });
  }
}

const ensureAuthenticated = (req, res, next) => {
  try {
      verifyJWT(req, res); // Call verifyJWT to verify the token
      return next(); // Proceed to the next middleware if successful
  } catch (error) {
      // Handle JWT verification errors gracefully
      console.error(error); // Log the error for debugging
      return res.redirect('/auth/login'); // Redirect to login page on failure
  }
};

module.exports = ensureAuthenticated;