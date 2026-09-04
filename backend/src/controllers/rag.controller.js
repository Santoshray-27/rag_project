const { generateEmbedding } = require("../services/embedding.service");
const { similaritySearch } = require("../services/vectorstore.service");
const { generateAnswer } = require("../services/llm.service");

const askDocument = async (req, res) => {
  try {
    const { question, topK = 3 } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    console.log("User Question:", question);

    // Step 1: Question ko embedding mein convert karo
    const queryEmbedding = await generateEmbedding(question);

    // Step 2: Vector DB se top relevant chunks retrieve karo (Filtered by User)
    const retrievedChunks = similaritySearch(queryEmbedding, topK, req.user._id);

    if (retrievedChunks.length === 0) {
      return res.status(200).json({
        success: true,
        answer: "No documents have been uploaded yet. Please upload a document first.",
        sources: [],
      });
    }

    console.log(`Retrieved ${retrievedChunks.length} chunks for context.`);

    // Step 3: LLM se answer generate karwao grounded context ke sath
    const answer = await generateAnswer(question, retrievedChunks);

    // Step 4: Citations / Sources format karo
    const sources = retrievedChunks.map((chunk) => ({
      fileName: chunk.fileName,
      chunkIndex: chunk.chunkIndex,
      similarity: Number(chunk.similarity.toFixed(4)),
      preview: chunk.content.slice(0, 150) + "...",
    }));

    return res.status(200).json({
      success: true,
      question,
      answer,
      sources,
    });
  } catch (error) {
    console.error("RAG error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  askDocument,
};

// TODO: Add streaming support later

// RAG controller ready

// TODO: Add streaming support later
