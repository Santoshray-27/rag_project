const express = require("express");
const router = express.Router();

const { searchDocuments } = require("../controllers/search.controller");
const { protect } = require("../middleware/auth.middleware");

// POST /api/search
router.post("/", protect, searchDocuments);

module.exports = router;

// Similarity Search Endpoints

// Search endpoints verified

// Similarity Search Endpoints
