# AI Knowledge Inbox – Backend

This repository contains the **backend service** for the *AI Knowledge Inbox* project.  
It is responsible for content ingestion, chunking, embedding orchestration, semantic search, and RAG-based question answering.

The backend is built using **Node.js + Express**, uses **SQLite via Prisma** for persistence, a **local MiniLM embedding server (Python/Flask)** for embeddings, and **Gemini API** for answer generation.

---

## 📌 Project Overview

### What this backend does

The backend enables users to:

1. Ingest **plain text notes** or **URLs**
2. Fetch and normalize content (for URLs)
3. Break content into **small, meaningful chunks**
4. Generate **vector embeddings** for each chunk
5. Store chunks + embeddings for semantic search
6. Accept a user question
7. Retrieve **top-K relevant chunks**
8. Send context + question to **Gemini LLM**
9. Return a final answer **with source citations**

This forms a **minimal but production-style RAG (Retrieval-Augmented Generation) pipeline**.

---

## 🧠 Why This Architecture?

### Separate Embedding Model vs LLM

- **Embeddings are not generative** → they don’t need a large LLM
- Using Gemini/OpenAI for embeddings would:
  - Waste tokens
  - Increase latency
  - Hit free-tier limits quickly

✅ **Solution**  
We use a **local MiniLM (Sentence Transformers)** model for embeddings  
and reserve **Gemini API** only for **final answer generation**.

---
## ⚠️ Prerequisite (Important)

Before starting the backend:

### ✅ Start the MiniLM embedding server first

Clone MiniLM repo:
```bash
https://github.com/rohsingh26/AI_Assignment-Knowledgeinbox-Local-LLM.git
```

The backend depends on:
```bash
http://localhost:8000/embed
```

MiniLM repo link:
```
https://github.com/rohsingh26/AI_Assignment-Knowledgeinbox-Local-LLM
```
- Refer to the MiniLM server README for setup instructions.

---

## 🔄 High-Level Flow

### Ingestion Flow
1. User submits **text or URL**
2. Backend fetches content (URL → HTML → clean text)
3. Content is **chunked into small sentence-based blocks**
4. Each chunk is sent to the **local MiniLM embedding server**
5. Returned vectors are stored with chunk metadata in SQLite

### Query Flow
1. User submits a **question**
2. Question is embedded using the **same MiniLM model**
3. Backend computes similarity with stored vectors
4. **Top-K most relevant chunks** are selected
5. These chunks + question are sent to **Gemini**
6. Gemini returns:
   - A concise answer
   - Referenced source chunks
7. Backend returns structured response to frontend

---

## 🔧 Tech Stack

- **Node.js + Express**
- **SQLite + Prisma**
- **Axios** (inter-service calls)
- **JSDOM** (HTML parsing)
- **Local MiniLM Embedding Server** (Python + Flask)
- **Gemini API** (answer generation)

---

## 🤖 Why Gemini?

- OpenAI APIs are paid
- Gemini provides a **free trial**
- Used **only for summarization / answer generation**
- Embeddings are handled locally to save tokens

---

## ⚖️ Trade-offs & Design Choices

### Trade-offs Made
- Vector storage is **simple (SQLite / in-memory)**  
  → not optimized for massive scale
- Chunking is **sentence-based**  
  → simple, readable, but not semantic-aware
- No authentication (single-user scope)
- No background job queues

### Why This Is Acceptable
- Interview task scope
- Optimizes for **clarity, correctness, and explainability**
- Demonstrates real-world RAG fundamentals

---

## 🚀 Production Improvements (Future)

If this were production-grade:

- Replace SQLite with:
  - Postgres + pgvector
  - Pinecone / Weaviate / Qdrant
- Add async ingestion queue (BullMQ / Celery)
- Smarter chunking (token-based with overlap)
- Streaming responses from LLM
- Authentication & multi-user isolation
- Observability (logs, tracing, metrics)

---

## 📂 Project Structure

```text
backend/
├── prisma/                 # Database schema and migrations
│   ├── migrations/         # Prisma migration history
│   ├── schema.prisma       # Database models (SQLite/Prisma)
│   └── data.db             # Local SQLite database file
├── scripts/                # Maintenance of Vector state on server restart
│   └── backfillEmbeddings.js
├── src/
│   ├── controllers/        # Request handling and response logic
│   │   ├── ingest.controller.js
│   │   ├── items.controller.js
│   │   └── query.controller.js
│   ├── routes/             # API endpoint definitions
│   │   ├── ingest.routes.js
│   │   ├── items.routes.js
│   │   └── query.routes.js
│   ├── services/           # Business logic and external integrations
│   │   ├── embedding.service.js            # MiniLM / Embedding logic
│   │   ├── fetchUrl.service.js             # Web scraping/content fetching
│   │   ├── gemini.service.js               # Google Gemini LLM integration
│   │   ├── rehydrateVectorStore.service.js # Vector state management
│   │   └── vectorStore.service.js          # Vector search operations
│   ├── utils/              # Helper functions and shared logic
│   │   ├── chunkText.js                    # Text splitting/chunking logic
│   │   ├── logger.js
│   │   └── vectorUtils.js                  # Vector math/utility helpers
│   ├── prismaClient.js     # Singleton Prisma client instance
│   └── index.js            # Express application entry point
├── .env                    # Environment variables
├── clearDb.js              # Script to reset database state
├── package.json            # Dependencies and scripts
├── prisma.config.ts        # Prisma configuration
└── README.md               # Project documentation
```


---

## 📥 Clone the Repository

```bash
git clone https://github.com/rohsingh26/AI_Assignment-Knowledgeinbox-backend.git
cd AI_Assignment-Knowledgeinbox-backend
```

---

## 🛠 Setup Instructions

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Environment Variables

Create a .env file:
```text
PORT=5000
DATABASE_URL="file:./data.db"
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3️⃣ Initialize Prisma
```bash
npx prisma generate
npx prisma migrate dev
```

### 4️⃣ Start the Backend Server
```bash
npm run dev
```

## Server will run at:
```text
http://localhost:5000
```


### To clear the local SQLite Database:
```bash
node clearDb.js
```

--- 

### 🔌 API Endpoints
- POST /ingest

Accepts text or URL

Chunks content

Generates embeddings

Stores data

- GET /items

Lists all saved items

- DELETE /items/:id

Deletes a particular context

- POST /query

Accepts a question

Performs semantic search

Returns answer + sources

---

### ✅ Summary

#### This backend demonstrates:

- Clean separation of concerns

- Practical RAG architecture

- Token-efficient AI usage

- Production-aware trade-offs

- Clear, explainable system design


### ➡️ Next step: Start the frontend
Go to the:
```bash
https://github.com/rohsingh26/AI_Assignment-Knowledgeinbox-frontend
```
