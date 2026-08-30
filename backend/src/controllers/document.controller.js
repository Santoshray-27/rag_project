const { extractTextFromPDF } = require("../services/pdf.service");
const { generateEmbeddings } = require("../services/embedding.service");
const {
  addDocument,
  getDocuments,
} = require("../services/vectorstore.service");
const Document = require("../models/document.model"); // Added Document Model

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("File received:", req.file.originalname);

    // Step 1: Extract + clean + chunk
    const extracted = await extractTextFromPDF(req.file.path, {
      chunkSize: 500,
      overlap: 100,
    });

    console.log(`Total chunks: ${extracted.totalChunks}`);

    // Step 2: Generate embeddings for chunk texts
    const chunkTexts = extracted.chunks.map((chunk) => chunk.content);
    const embeddings = await generateEmbeddings(chunkTexts);

    console.log(`Embeddings generated: ${embeddings.length}`);

    // Step 3: Store in vector store (pass req.user._id)
    const documentId = `doc_${Date.now()}`;

    addDocument(
      documentId,
      req.file.originalname,
      extracted.chunks,
      embeddings,
      req.user._id
    );

    // Step 4: Save record to MongoDB
    await Document.create({
      userId: req.user._id,
      documentId: documentId,
      fileName: req.file.originalname,
      totalChunks: extracted.totalChunks,
      pages: extracted.pages,
    });

    return res.status(200).json({
      success: true,
      message: "Document uploaded and processed successfully",
      document: {
        documentId,
        fileName: req.file.originalname,
        totalChunks: extracted.totalChunks,
        pages: extracted.pages,
      },
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    // Fetch only this user's documents
    const documents = getDocuments(req.user._id);

    return res.status(200).json({
      success: true,
      documents,
      total: documents.length,
    });
  } catch (error) {
    console.error("Get documents error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getAllDocuments,
};
// Document controller reviewed
