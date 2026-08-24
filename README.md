# DocuMind - RAG System

DocuMind is a Retrieval-Augmented Generation (RAG) application that allows users to upload documents, process them into embeddings, and perform semantic similarity searches to extract relevant information.

## Project Structure

- **/backend**: Node.js and Express server handling all the core APIs (Document parsing, Embedding generation, Vector storage, and Similarity search).
- **/frontend**: Client-side application for the user interface.
- **/services**: Extra decoupled services for managing specific tasks.

## Features

### 1. **Similarity Search API**
- **Endpoint**: `POST /api/search`
- **Description**: Accepts a natural language query and returns the most relevant chunks from uploaded documents based on their semantic meaning rather than exact word matches.
- **Under the hood**: The user's query is converted into an embedding and compared against stored document chunk embeddings using vector similarity search (like cosine similarity).

### 2. **Document Upload API**
- **Endpoint**: `POST /api/documents`
- **Description**: Handles file uploads, extracts text, splits the text into chunks, generates embeddings, and saves them to the vector store.

### 3. **Health Check API**
- **Endpoint**: `GET /api/health`
- **Description**: Simple ping endpoint to verify that the backend server is running successfully.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.

### Running the Backend Locally
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary dependencies (if not done yet):
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The backend server should now be running on `http://localhost:5000`.

## Testing the APIs (Example: Semantic Search)
You can use tools like Postman to interact with the endpoints.

**POST** `http://localhost:5000/api/search`
**Headers**: `Content-Type: application/json`
**Body**:
```json
{
  "query": "What is Santosh's email?",
  "topK": 3
}
```

**Expected Result**:
You will receive a JSON response containing an array of `results` with the chunks of text that match the meaning of your query, along with their similarity scores.
