const jwt = require('jsonwebtoken');
const { isBlacklisted } = require('../middleware/blacklist.js');

function authenticateToken(req, res, next) {
  const token = req.cookies.accessToken || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access detected' });
  }

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

module.exports =  { authenticateToken };