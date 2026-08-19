const fs = require("fs");
const path = require("path");

// Vector store file location
const VECTOR_STORE_PATH = path.join(__dirname, "../../data/vectorstore.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(__dirname, "../../data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load vector store from file
const loadVectorStore = () => {
  ensureDataDir();

  if (!fs.existsSync(VECTOR_STORE_PATH)) {
    return { documents: [] };
  }

  const data = fs.readFileSync(VECTOR_STORE_PATH, "utf-8");
  return JSON.parse(data);
};

// Save vector store to file
const saveVectorStore = (store) => {
  ensureDataDir();
  fs.writeFileSync(VECTOR_STORE_PATH, JSON.stringify(store, null, 2));
};

// Add document chunks + embeddings to store
const addDocument = (documentId, fileName, chunks, embeddings) => {
  const store = loadVectorStore();

  // Remove existing entries for this document
  store.documents = store.documents.filter(
    (doc) => doc.documentId !== documentId
  );

  // Add new entries
  chunks.forEach((chunk, index) => {
    store.documents.push({
      id: `${documentId}_chunk_${index}`,
      documentId: documentId,
      fileName: fileName,
      chunkIndex: chunk.chunkIndex,
      content: chunk.content,
      embedding: embeddings[index],
      metadata: {
        startIndex: chunk.startIndex,
        endIndex: chunk.endIndex,
        uploadedAt: new Date().toISOString(),
      },
    });
  });

  saveVectorStore(store);

  console.log(`Stored ${chunks.length} chunks for document: ${fileName}`);
  return store.documents.length;
};

// Cosine similarity between two vectors
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Search similar chunks for a query embedding
const similaritySearch = (queryEmbedding, topK = 5) => {
  const store = loadVectorStore();

  if (store.documents.length === 0) {
    return [];
  }

  // Calculate similarity for each chunk
  const results = store.documents.map((doc) => ({
    ...doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  // Sort by similarity (highest first)
  results.sort((a, b) => b.similarity - a.similarity);

  // Return top K results
  return results.slice(0, topK).map((doc) => ({
    content: doc.content,
    fileName: doc.fileName,
    chunkIndex: doc.chunkIndex,
    similarity: doc.similarity,
    metadata: doc.metadata,
  }));
};

// Get all documents list
const getDocuments = () => {
  const store = loadVectorStore();

  const docs = {};
  store.documents.forEach((doc) => {
    if (!docs[doc.documentId]) {
      docs[doc.documentId] = {
        documentId: doc.documentId,
        fileName: doc.fileName,
        chunkCount: 0,
        uploadedAt: doc.metadata.uploadedAt,
      };
    }
    docs[doc.documentId].chunkCount++;
  });

  return Object.values(docs);
};

// Delete a document
const deleteDocument = (documentId) => {
  const store = loadVectorStore();
  const before = store.documents.length;

  store.documents = store.documents.filter(
    (doc) => doc.documentId !== documentId
  );

  const deleted = before - store.documents.length;
  saveVectorStore(store);

  return deleted;
};

module.exports = {
  addDocument,
  similaritySearch,
  getDocuments,
  deleteDocument,
};