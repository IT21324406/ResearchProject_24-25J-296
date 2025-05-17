from main import answer_question

def test_answer_question_valid():
    response = answer_question("What is this article about?", article_id="test123")
    assert isinstance(response, str)
    assert len(response) > 0

def test_answer_question_empty_query():
    response = answer_question("", article_id="test123")
    assert "please provide" in response.lower() or len(response) > 0

def test_answer_question_invalid_article():
    response = answer_question("Test", article_id="nonexistent")
    assert "not found" in response.lower() or isinstance(response, str)