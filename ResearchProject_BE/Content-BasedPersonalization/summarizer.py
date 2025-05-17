from bs4 import BeautifulSoup
import requests
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

class ArticleSummarizer:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    def fetch_article_text(self, url: str) -> str:
        """Fetch and extract text content from an article URL."""
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            raise Exception("Failed to fetch article.")
        
        soup = BeautifulSoup(response.text, "html.parser")
        paragraphs = soup.find_all("p")
        return " ".join(p.text for p in paragraphs)
    
    def generate_summary(self, text: str, summary_type: str) -> str:
        """Generate summary using OpenAI API."""
        prompt = f"Summarize the following article in {summary_type} format:\n\n{text}"
        
        response = self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        
        return response.choices[0].message.content
    
    def summarize_article(self, url: str, summary_type: str) -> dict:
        """Complete summarization pipeline for an article URL."""
        try:
            article_text = self.fetch_article_text(url)
            summary = self.generate_summary(article_text, summary_type)
            return {
                "success": True,
                "summary": summary,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "summary": None,
                "error": str(e)
            }