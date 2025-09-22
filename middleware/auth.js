const jwt = require('jsonwebtoken');
const { addToBlacklist, isBlacklisted } = require('./blacklist.js');

function isHTMLRequest(req) {
  const accept = req.headers['accept'] || '';
  return accept.includes('text/html');
}

function authenticateToken(req, res, next) {
  const token = req.cookies && req.cookies.accessToken
    || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

  if (!token) {
    if (isHTMLRequest(req)) {
      return res.redirect('/login');
    }
    return res.status(401).json({ error: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded && decoded.jti && isBlacklisted(decoded.jti)) {
      if (isHTMLRequest(req)) {
        return res.redirect('/login');
      }
      return res.status(401).json({ error: 'Token is blacklisted' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    if (isHTMLRequest(req)) {
      return res.redirect('/login');
    }
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticateToken };