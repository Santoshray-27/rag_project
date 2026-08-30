const { generateEmbedding } = require("../services/embedding.service");
const { similaritySearch } = require("../services/vectorstore.service");

const searchDocuments = async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    console.log("Search query:", query);

    // Step 1: Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    console.log("Query embedding generated");

    // Step 2: Search vector store for top K matching chunks (Filtered by User)
    const results = similaritySearch(queryEmbedding, topK, req.user._id);

    console.log(`Found ${results.length} relevant chunks`);

    return res.status(200).json({
      success: true,
      query: query,
      results: results,
      totalResults: results.length,
    });

  } catch (error) {
    console.error("Search error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  searchDocuments,
};

// Search Controller Ready

// Search flow reviewed
