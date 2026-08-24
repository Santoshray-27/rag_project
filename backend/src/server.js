require("dotenv").config();

const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const documentRoutes = require("./routes/document.routes");
const searchRoutes = require("./routes/search.routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/search", searchRoutes);

// ─── Root ─────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Welcome to DocuMind Backend");
});

// ─── 404 Handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});