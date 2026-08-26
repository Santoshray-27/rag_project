const express = require("express");
const router = express.Router();

const { askDocument } = require("../controllers/rag.controller");

// POST /api/rag/ask
router.post("/ask", askDocument);

module.exports = router;
