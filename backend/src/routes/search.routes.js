const express = require("express");
const router = express.Router();

const { searchDocuments } = require("../controllers/search.controller");

// POST /api/search
router.post("/", searchDocuments);

module.exports = router;
