require("dotenv").config();

const {
    generateEmbedding,
} = require("./services/embedding.service");

const test = async () => {
    try {
        console.log("Testing embedding generation...\n");

        const text1 = "Santosh is a software developer from Indore";
        const text2 = "What is Santosh's profession?";
        const text3 = "Recipe for making chocolate cake";

        console.log("Text 1:", text1);
        const emb1 = await generateEmbedding(text1);
        console.log("Embedding length:", emb1.length);
        console.log("First 5 values:", emb1.slice(0, 5));

        console.log("\nText 2:", text2);
        const emb2 = await generateEmbedding(text2);
        console.log("Embedding length:", emb2.length);
        console.log("First 5 values:", emb2.slice(0, 5));

        console.log("\nText 3:", text3);
        const emb3 = await generateEmbedding(text3);
        console.log("Embedding length:", emb3.length);
        console.log("First 5 values:", emb3.slice(0, 5));

        // Cosine similarity calculate karo
        const similarity12 = cosineSimilarity(emb1, emb2);
        const similarity13 = cosineSimilarity(emb1, emb3);

        console.log("\n=== SIMILARITY RESULTS ===");
        console.log(`"${text1}" vs "${text2}"`);
        console.log(`Similarity: ${similarity12.toFixed(4)}`);

        console.log(`\n"${text1}" vs "${text3}"`);
        console.log(`Similarity: ${similarity13.toFixed(4)}`);

        console.log("\n✅ Embedding generation working!");

    } catch (error) {
        console.error("Error:", error.message);
    }
};

// Cosine similarity function
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

test();