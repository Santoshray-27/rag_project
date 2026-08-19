const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload.middleware");
const {
  uploadDocument,
  getAllDocuments,
} = require("../controllers/document.controller");

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/", getAllDocuments);

module.exports = router;