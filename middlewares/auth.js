const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, continue to the next middleware
    }
    // Redirect to login page if not authenticated
    return res.redirect('/auth/login');
};

module.exports = ensureAuthenticated;