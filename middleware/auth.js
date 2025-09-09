const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../utils/blacklist');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized access detected' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (isBlacklisted(decoded.jti)) {
      return res.status(403).json({ error: 'Forbidden: Token is blacklisted' });
    }

    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
}