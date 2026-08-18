require('dotenv').config();
const express = require('express')
const cors = require('cors')


const healthRoutes = require('./routes/health.route')
const errorHandler = require('./middleware/error.middleware')


const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to DocuMind Backend");
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});