const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const extractTextFromPDF = async (filePath) => {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  const fileBuffer = fs.readFileSync(absolutePath);

  const parser = new PDFParse({ data: fileBuffer });

  try {
    const result = await parser.getText();

    let info = {};
    if (typeof parser.getInfo === "function") {
      info = await parser.getInfo();
    }

    return {
      text: result?.text || "",
      pages: result?.totalPages || result?.numpages || 0,
      info,
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