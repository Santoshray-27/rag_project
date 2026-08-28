const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  // Sign a new token with the user's ID
  // It will expire in 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;

// JWT utility ready

// JWT utility ready
