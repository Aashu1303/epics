const ensureAuthenticated = (req, res, next) => {
    console.log(req.headers.Authorization);
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, continue to the next middleware
    }
    // Redirect to login page if not authenticated
    res.redirect('/auth/login');
};

module.exports = ensureAuthenticated;