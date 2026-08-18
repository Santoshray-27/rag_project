require('dotenv').config();
const express = require('express')

const healthRoutes = require('./routes/health.route')

const app = express();
const PORT = process.env.PORT;

// Routes
app.use('/api/health', healthRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to DocuMind Backend");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});