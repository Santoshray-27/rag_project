const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use gemini-2.5-flash as the previous one was giving 503 High Demand
const generativeModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

/**
 * Generate answer using retrieved context chunks
 */
const generateAnswer = async (question, contextChunks) => {
  // Context text construct karo
  const formattedContext = contextChunks
    .map((chunk, idx) => `[Source ${idx + 1} | File: ${chunk.fileName}]:\n${chunk.content}`)
    .join("\n\n---\n\n");

  // Strict Grounded System Prompt
  const prompt = `
You are DocuMind, a precise and helpful AI Document Assistant.

Instructions:
1. Answer the user's question using ONLY the provided context below.
2. Be direct, factual, and concise.
3. If the context does not contain enough information to answer the question, clearly state: "I could not find the answer to this question in the provided documents."
4. Do not assume or extrapolate beyond what is stated in the context.

Context:
---------------------
${formattedContext}
---------------------

User Question: ${question}

Answer:
`.trim();

  const result = await generativeModel.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

module.exports = {
  generateAnswer,
};

// LLM Service Ready

// LLM generation flow verified

// LLM Service Ready

// LLM Service Ready

// LLM Service Ready
