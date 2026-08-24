# DocuMind - AI-Powered RAG Document Assistant

DocuMind is an AI-powered Retrieval-Augmented Generation (RAG) system that acts as a "ChatGPT for your own documents." Users can upload documents (like PDFs), and the system extracts, chunks, and embeds the text into a vector database. When a user asks a question, DocuMind performs a semantic similarity search to retrieve the most relevant context and generates an accurate, grounded answer with citations.

---

## 🏗️ Architecture & Project Structure

The project follows a decoupled architecture, separating the client-side UI, the main API gateway, and specialized microservices for heavy processing or AI tasks.

```text
documind_rag/
│
├── frontend/             # React + Vite Client
│   ├── public/
│   └── src/              # UI Components, Pages, Context, Hooks
│
├── backend/              # Node.js + Express API Server
│   └── src/
│       ├── controllers/  # Route logic (e.g., search.controller.js)
│       ├── middleware/   # Express middleware
│       ├── routes/       # API endpoints (e.g., search.routes.js, document.routes.js)
│       └── services/     # Business logic & interactions with Python services
│
└── services/             # Python FastAPI / AI Services
    └── venv/             # Python Virtual Environment
```

---

## 🚀 Tech Stack

### **Frontend**
- **Framework:** React
- **Build Tool:** Vite

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Architecture:** REST APIs

### **AI & Data Processing (Services)**
- **Framework:** FastAPI (Python)
- **Validation:** Pydantic
- **Server:** Uvicorn
- **Capabilities:** Embeddings generation, Text Chunking, Vector Storage, Semantic Search, and LLM Integration.

---

## 🎯 Core Features

### 1. **Document Processing (Ingestion)**
- **Upload:** Accepts PDF and text documents.
- **Extraction & Cleaning:** Extracts readable text and cleans formatting.
- **Chunking:** Splits large documents into smaller, meaningful segments for better retrieval.

### 2. **Knowledge Base (Vector DB)**
- **Embeddings:** Converts text chunks into numerical vectors (semantic representation).
- **Storage:** Stores chunks, embeddings, and metadata in a Vector Database.

### 3. **Retrieval-Augmented Generation (RAG)**
- **Semantic Search:** Converts user questions into embeddings and retrieves the Top-K most relevant document chunks based on meaning (not just exact keyword match).
- **LLM Grounding:** Sends the retrieved context along with the question to an LLM to generate an accurate answer.
- **Citations:** Provides source document and page references for the generated answers.

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (v3.9+)

### 1. Setup Backend (Node/Express)
```bash
cd backend
npm install
npm run dev
```
*Runs on http://localhost:5000*

### 2. Setup Frontend (React/Vite)
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:5173*

### 3. Setup AI Services (Python/FastAPI)
```bash
cd services
# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Start the Python service (adjust command based on your entry file)
uvicorn main:app --reload
```

---

## 🧠 Learning Goals of this Project
DocuMind is built as an educational vehicle to master:
- Full Stack Development (MERN/PERN architecture)
- System Design & API separation
- The mathematics and implementation of Embeddings and Vector Search
- LLM Prompts, Context Windows, and reducing Hallucinations through RAG
- Software Engineering best practices (Clean Code, Git workflows, Authentication, Deployment)
