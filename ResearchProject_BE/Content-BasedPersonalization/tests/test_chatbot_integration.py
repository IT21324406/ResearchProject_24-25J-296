import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_chatbot_route():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/chat", json={"question": "What is the summary?", "article_id": "123"})
    assert response.status_code == 200
    assert "answer" in response.json()