const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit to 100 requests per window
  message: 'You have exceeded the 100 requests in 15 minutes limit!',
});

module.exports = limiter;
