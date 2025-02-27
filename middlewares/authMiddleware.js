const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.jwtToken;
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded; // Attach decoded user data to the request
    next();
  });
};

// ✅ Middleware to restrict access based on role
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

const destroyToken = (req, res, next) => {
  res.clearCookie("jwtToken");
  next();
};

module.exports = { verifyToken, authorizeRoles, destroyToken };
