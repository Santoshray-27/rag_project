const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const { processText } = require("./text.service");

const extractTextFromPDF = async (filePath, options = {}) => {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const parser = new PDFParse({ data: fileBuffer });

  try {
    const result = await parser.getText();
    const rawText = result?.text || "";

    // Clean + Chunk
    const processed = processText(rawText, {
      chunkSize: options.chunkSize || 500,
      overlap: options.overlap || 100,
    });

    console.log("=== TEXT PROCESSING SUMMARY ===");
    console.log("Original length:", processed.originalLength);
    console.log("Cleaned length:", processed.cleanedLength);
    console.log("Total chunks:", processed.totalChunks);

    return {
      rawText: rawText,
      cleanedText: processed.cleanedText,
      chunks: processed.chunks,
      totalChunks: processed.totalChunks,
      pages: result?.totalPages || 0,
    };

  } finally {
    if (typeof parser.destroy === "function") {
      await parser.destroy();
    }
  }
};

module.exports = {
  extractTextFromPDF,
};
// PDF parser verified
