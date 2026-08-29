/**
 * Text cleaning and chunking service
 */

// ─── Clean raw text ───────────────────────────────
const cleanText = (text) => {
  if (!text) return "";

  let cleaned = text
    // Multiple newlines → single newline
    .replace(/\n{3,}/g, "\n\n")
    // Multiple spaces → single space
    .replace(/[ \t]+/g, " ")
    // Trim each line
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    // Trim overall
    .trim();

  return cleaned;
};

// ─── Split text into overlapping chunks ───────────
const chunkText = (text, options = {}) => {
  const {
    chunkSize = 500,
    overlap = 100,
  } = options;

  if (!text || text.length === 0) {
    return [];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    let endIndex = startIndex + chunkSize;

    // Don't exceed text length
    if (endIndex > text.length) {
      endIndex = text.length;
    }

    // Try to end at sentence boundary
    if (endIndex < text.length) {
      const searchArea = text.slice(startIndex, endIndex);
      const lastSentenceEnd = Math.max(
        searchArea.lastIndexOf(". "),
        searchArea.lastIndexOf(".\n"),
        searchArea.lastIndexOf("! "),
        searchArea.lastIndexOf("? ")
      );

      if (lastSentenceEnd > chunkSize * 0.5) {
        endIndex = startIndex + lastSentenceEnd + 1;
      }
    }

    const chunk = text.slice(startIndex, endIndex).trim();

    if (chunk.length > 0) {
      chunks.push({
        content: chunk,
        startIndex: startIndex,
        endIndex: endIndex,
        chunkIndex: chunks.length,
      });
    }

    // Move forward with overlap
    startIndex = endIndex - overlap;

    // Prevent infinite loop
    if (startIndex >= text.length - overlap) {
      break;
    }
  }

  return chunks;
};

// ─── Process: clean + chunk ───────────────────────
const processText = (rawText, options = {}) => {
  const cleaned = cleanText(rawText);
  const chunks = chunkText(cleaned, options);

  return {
    cleanedText: cleaned,
    chunks: chunks,
    totalChunks: chunks.length,
    originalLength: rawText.length,
    cleanedLength: cleaned.length,
  };
};

module.exports = {
  cleanText,
  chunkText,
  processText,
};
// Text chunking verified
