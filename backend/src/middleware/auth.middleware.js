const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const protect = async (req, res, next) => {
  let token;

  // Check if the authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (Format: "Bearer eyJhbGci...")
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch the user from the database and attach it to req.user
      // We use .select("-password") to ensure the password is NOT included
      req.user = await User.findById(decoded.id).select("-password");

      // Move to the next middleware or controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
  }

  // If no token was found at all
  if (!token) {
    res.status(401).json({ success: false, message: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
