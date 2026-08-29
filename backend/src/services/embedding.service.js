const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const embeddingModel = genAI.getGenerativeModel({
    model: 'gemini-embedding-2',
});

// Single text -> one embedding vector
const generateEmbedding = async (text) => {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
};

// Multiple texts -> array of embeddings
const generateEmbeddings = async (texts) => {
    const embeddings = [];

    for (let i = 0; i < texts.length; i++) {
        console.log(`Generating embedding ${i + 1}/${texts.length}...`);
        const vector = await generateEmbedding(texts[i]);
        embeddings.push(vector);
    }

    return embeddings;
};

module.exports = {
    generateEmbedding,
    generateEmbeddings,
};
// Embedding service optimized
