from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
import requests
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import os

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (Allow requests from frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get OpenAI API Key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Request model
class SummaryRequest(BaseModel):
    url: str
    type: str

def fetch_medium_article(url):
    """Fetch and extract text content from a Medium article."""
    headers = {"User-Agent": "Mozilla/5.0"}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to fetch Medium article.")
    
    soup = BeautifulSoup(response.text, "html.parser")
    paragraphs = soup.find_all("p")
    text = " ".join(p.text for p in paragraphs)
    return text

@app.post("/summarize")
async def summarize(request: SummaryRequest):
    """Generate summary using OpenAI API."""
    try:
        article_text = fetch_medium_article(request.url)
        prompt = f"Summarize the following article in {request.type} format:\n\n{article_text}"
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo", # Use "gpt-4" for better results
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        
        summary = response["choices"][0]["message"]["content"]
        return {"summary": summary}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def read_root():
    return {"message": "Backend is working!"}
