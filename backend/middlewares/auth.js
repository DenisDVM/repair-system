const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};