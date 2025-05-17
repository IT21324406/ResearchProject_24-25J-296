from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bs4 import BeautifulSoup
from openai import OpenAI
import requests
import faiss
import numpy as np
import os
from dotenv import load_dotenv
import logging
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import Normalizer
from mindmap_generator import extract_article_text, extract_svo_relationships
from summarizer import ArticleSummarizer

# Initialize
load_dotenv()
app = FastAPI()
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

summarizer = ArticleSummarizer()  
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Initialize TF-IDF pipeline (global)
tfidf_pipeline = make_pipeline(
    TfidfVectorizer(max_features=5000),
    Normalizer()  # L2 normalization for FAISS
)

# Global state
vector_index = None
documents = []
is_fitted = False  # Track if TF-IDF is fitted

# Greeting phrases
GREETINGS = ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening"]

# Models
class ChatRequest(BaseModel):
    url: str
    question: str

class URLRequest(BaseModel):
    url: str

class SummaryRequest(BaseModel):
    url: str
    type: str

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def fetch_medium_article(url: str) -> str:
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        return " ".join(p.get_text() for p in soup.find_all("p"))
    except Exception as e:
        logger.error(f"Failed to fetch article: {str(e)}")
        raise HTTPException(status_code=400, detail="Article fetch failed")

def split_text(text: str, max_tokens: int = 500) -> list[str]:
    sentences = text.split(". ")
    chunks, current_chunk = [], ""
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_tokens:
            current_chunk += sentence + ". "
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence + ". "
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

def get_embeddings(texts: list[str]) -> np.ndarray:
    """Generate normalized TF-IDF embeddings"""
    global is_fitted
    try:
        if not is_fitted:
            # First-time fitting
            embeddings = tfidf_pipeline.fit_transform(texts).toarray()
            is_fitted = True
        else:
            # Subsequent transformations
            embeddings = tfidf_pipeline.transform(texts).toarray()
        return embeddings.astype('float32')  # FAISS requires float32
    except Exception as e:
        logger.error(f"Embedding failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}")

def is_greeting(message: str) -> bool:
    """Check if the message is a greeting"""
    return message.lower().strip() in GREETINGS

@app.post("/chat")
async def chat_with_article(data: ChatRequest):
    global vector_index, documents
    
    try:
        # Check for greetings
        if is_greeting(data.question):
            return {
                "answer": "Hello! I'm your article assistant. Please feel free to ask questions about this article."
            }

        # 1. Get article content
        article_text = fetch_medium_article(data.url)
        chunks = split_text(article_text)
        documents = chunks

        # 2. Get embeddings
        embeddings = get_embeddings(chunks)
        
        # 3. Build/update FAISS index
        if vector_index is None:
            dimension = embeddings.shape[1]
            vector_index = faiss.IndexFlatL2(dimension)
        vector_index.add(embeddings)

        # 4. Process question
        question_embedding = get_embeddings([data.question])
        distances, indices = vector_index.search(question_embedding, k=3)
        context = "\n\n".join(documents[i] for i in indices[0])

        # 5. Generate response using the new client format
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Answer using only the provided context."},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {data.question}"}
            ],
            temperature=0.7
        )
        return {"answer": response.choices[0].message.content}  

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Processing failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

@app.get("/")
def health_check():
    return {
        "status": "OK",
        "embedding_service": "TF-IDF (scikit-learn)",
        "llm": "OpenAI GPT-3.5-turbo"
    }

@app.post("/mindmap")
def generate_mindmap(data: dict):
    url = data.get("url")
    if not url:
        return {"error": "Missing URL"}

    try:
        text = extract_article_text(url)
        mindmap_data = extract_svo_relationships(text)
        return {"mindmap": mindmap_data}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("/summarize")
async def summarize(request: SummaryRequest):
    """Endpoint for summarizing articles using the ArticleSummarizer class"""
    result = summarizer.summarize_article(request.url, request.type)
    if result["success"]:
        return {"summary": result["summary"]}
    else:
        raise HTTPException(status_code=500, detail=result["error"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)