const { extractTextFromPDF } = require("../services/pdf.service");

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("File received:", req.file.originalname);
    console.log("File path:", req.file.path);

    const extracted = await extractTextFromPDF(req.file.path);


    return res.status(200).json({
      success: true,
      message: "File uploaded and text extracted successfully",
      file: {
        originalName: req.file.originalname,
        savedAs: req.file.filename,
        size: req.file.size,
        pages: extracted.pages,
      },
      preview: extracted.text,
      totalCharacters: extracted.text.length,
    });

  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
};