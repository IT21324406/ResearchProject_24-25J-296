import pytest
from main import generate_summary

def test_generate_summary_points():
    result = generate_summary("This is a test article.", "points")
    assert isinstance(result, str)
    assert "•" in result or "-" in result  # Assuming bullets for point-style

def test_generate_summary_short():
    result = generate_summary("This is a test article.", "short")
    assert len(result.split()) < 50  # Assuming short summaries are short enough

def test_generate_summary_long():
    result = generate_summary("This is a test article.", "long")
    assert len(result.split()) > 50  # Long summary assumed to be detailed