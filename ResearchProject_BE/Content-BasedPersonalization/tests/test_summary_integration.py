import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_summary_route():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/summary", json={"content": "Test article", "type": "points"})
    assert response.status_code == 200
    assert "summary" in response.json()