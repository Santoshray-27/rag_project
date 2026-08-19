const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload.middleware')
const {uploadDocument} = require('../controllers/document.controller')

// POST /api/document/upload
router.post("/upload", upload.single('file'), uploadDocument);

module.exports = router;