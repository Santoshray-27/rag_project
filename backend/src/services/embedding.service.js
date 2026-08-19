const { GoogleGenerativeAI } = require("@google/generative-ai")
require('dotenv').config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const embeddingModel = genAI.getGenerativeModel({
    model: "gemini-embedding-2"
})

// Single text -> embedding
const generateEmbedding = async (text) => {
    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
}

// Multiple texts -> embeddings
const generateEmbeddings = async (texts) => {
    const embedding = [];

    for (let i = 0; i < texts.length; i++) {
        console.log(`GENEARTING EMBEDDING ${i + 1}/${texts.length}...`)
        const embedding = await generateEmbedding(texts[i]);
        embeddings.push(embedding);
    }
    return embeddings;
}

module.exports = {
    generateEmbedding,
    generateEmbeddings
}