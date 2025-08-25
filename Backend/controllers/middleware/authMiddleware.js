const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check both cookie and header
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");
  
  // console.log("Token from cookie:", req.cookies.token);
  // console.log("Token from header:", req.header("Authorization"));
  // console.log("Final token:", token);

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the same secret key
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
