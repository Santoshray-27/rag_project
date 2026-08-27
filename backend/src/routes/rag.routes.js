const express = require("express");
const router = express.Router();

const { askDocument } = require("../controllers/rag.controller");
const { protect } = require("../middleware/auth.middleware");

// POST /api/rag/ask
router.post("/ask", protect, askDocument);

module.exports = router;

// RAG API endpoints
