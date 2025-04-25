const jwt = require('jsonwebtoken')


// Middleware to verify if the user is authenticated
const verifyToken = (req, res, next) => {
// Issue: No JWT verification here yet(fixed)
const authHeader = req.headers.authorization;
if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
}

const token = authHeader.split(' ')[1]; // Assuming Bearer token format
try {
  // Verify JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded; 
  next();
} catch (err) {
  return res.status(401).json({ message: 'Invalid token' });
}
// next();
}
// Middleware to verify if the user is an admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
