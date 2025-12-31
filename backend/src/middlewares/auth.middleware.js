const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies token and attaches user to request
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Expect: Authorization: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token missing'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
}

module.exports = authenticateToken;
