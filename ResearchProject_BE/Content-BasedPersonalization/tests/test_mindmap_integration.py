import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_mindmap_route():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/mindmap", json={"url": "https://medium.com/test"})
    assert response.status_code == 200
    assert "nodes" in response.json()