# RAG Assistant

A Retrieval-Augmented Generation (RAG) app that lets you upload a PDF and ask questions about it. The backend extracts and chunks the document, indexes it in a vector database, retrieves the most relevant chunks for a given question, and generates an answer grounded strictly in that context.

## Features

- 📄 Upload any text-based PDF and index it in seconds
- 🔍 Semantic search over document chunks using ChromaDB
- 🤖 Context-grounded answers via Hugging Face Inference API — the model is instructed to say "I don't know" if the answer isn't in the document, avoiding hallucination
- 🧹 Automatic cleanup of old documents when a new one is uploaded, and on session end
- ⚡ Fast local vector search, no external database required

## Tech Stack

**Backend**
- FastAPI
- ChromaDB (persistent local vector store)
- pypdf (PDF text extraction)
- Hugging Face Inference API (`huggingface_hub`)

**Frontend**
- React
- Vite

## Project Structure

```
RAG-assistant/
├── backend/
│   ├── main.py          # FastAPI app, upload/ask/clear endpoints
│   ├── rag.py            # LLM prompt + Hugging Face inference call
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   └── App.jsx       # UI: upload, ask, answer display
│   └── package.json
└── .gitignore
```

## How It Works

1. **Upload** — the PDF is parsed with `pypdf`, split into overlapping text chunks, and stored in a local ChromaDB collection.
2. **Ask** — your question is embedded and matched against the stored chunks using semantic similarity search.
3. **Answer** — the top-matching chunks are passed as context to the LLM, which is prompted to answer *only* from that context.

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with your Hugging Face token:

```
HF_TOKEN=your_huggingface_token_here
```

Run the backend:

```bash
uvicorn main:app --reload
```

The API will be live at `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be live at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint  | Description                          |
|--------|-----------|---------------------------------------|
| GET    | `/`       | Health check                          |
| POST   | `/upload` | Upload and index a PDF                |
| POST   | `/ask`    | Ask a question about the indexed PDF  |
| POST   | `/clear`  | Clear the currently indexed document  |
| GET    | `/chunks` | View indexed chunk count/preview      |

## Roadmap

- [ ] Convert to agentic RAG with a self-evaluation loop (LangGraph)
- [ ] Support multiple documents at once
- [ ] Add source citations in answers

## Author

**Akhileshwar Mittapelly**
[LinkedIn](https://linkedin.com/in/akhileshwar-mittapelly-b6315924b) · [GitHub](https://github.com/Akhil4556)
