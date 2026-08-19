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

    const extracted = await extractTextFromPDF(req.file.path, {
      chunkSize: 500,
      overlap: 100,
    });

    return res.status(200).json({
      success: true,
      message: "File uploaded and processed successfully",
      file: {
        originalName: req.file.originalname,
        savedAs: req.file.filename,
        size: req.file.size,
        pages: extracted.pages,
      },
      processing: {
        originalLength: extracted.rawText.length,
        cleanedLength: extracted.cleanedText.length,
        totalChunks: extracted.totalChunks,
      },
      chunksPreview: extracted.chunks.slice(0, 3).map((chunk) => ({
        chunkIndex: chunk.chunkIndex,
        content: chunk.content.slice(0, 200) + "...",
        length: chunk.content.length,
      })),
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