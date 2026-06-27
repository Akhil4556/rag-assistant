from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pypdf import PdfReader
import chromadb
import os
from rag import generate_answer

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads folder
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ChromaDB setup
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="pdf_documents")


# Request model
class QuestionRequest(BaseModel):
    question: str


@app.get("/")
def home():
    return {"message": "RAG Backend Running"}


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # Save uploaded PDF
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text from PDF
    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text

    # Guard: check if any text was extracted
    if not text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from this PDF. It may be a scanned image-based PDF."
        )

    # Chunk text — filter out empty chunks
    chunk_size = 500
    chunks = []

    for i in range(0, len(text), chunk_size):
        chunk = text[i:i + chunk_size].strip()
        if chunk:
            chunks.append(chunk)

    # Guard: check if chunks were created
    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="No valid text chunks could be created from this PDF."
        )

    # Delete existing chunks for this file to avoid duplicates on re-upload
    try:
        existing = collection.get()
        ids_to_delete = [
            id for id in existing["ids"]
            if id.startswith(file.filename)
        ]
        if ids_to_delete:
            collection.delete(ids=ids_to_delete)
    except Exception:
        pass

    # Store chunks in ChromaDB
    collection.add(
        documents=chunks,
        ids=[f"{file.filename}_{i}" for i in range(len(chunks))]
    )

    return {
        "message": "PDF uploaded successfully",
        "chunks_created": len(chunks)
    }


@app.get("/chunks")
def get_chunks():
    data = collection.get()
    return {
        "total_chunks": len(data["documents"]),
        "documents": data["documents"][:5]
    }


@app.post("/ask")
def ask_question(request: QuestionRequest):

    results = collection.query(
        query_texts=[request.question],
        n_results=3
    )

    context = "\n".join(results["documents"][0])

    answer = generate_answer(context, request.question)

    return {
        "question": request.question,
        "answer": answer
    }