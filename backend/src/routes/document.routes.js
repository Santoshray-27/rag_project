const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const {
  uploadDocument,
  getAllDocuments,
} = require("../controllers/document.controller");
const { protect } = require("../middleware/auth.middleware");

// Apply protect middleware to these routes
router.post("/upload", protect, upload.single("file"), uploadDocument);
router.get("/", protect, getAllDocuments);

module.exports = router;
// Document Management Endpoints
