from main import extract_svo

def test_extract_svo_with_valid_text():
    text = "The cat chased the mouse."
    result = extract_svo(text)
    assert isinstance(result, list)
    assert len(result) > 0

def test_extract_svo_with_empty_text():
    result = extract_svo("")
    assert result == []

def test_extract_svo_with_complex_text():
    text = "Although it was raining, the boy went to school and studied hard."
    result = extract_svo(text)
    assert isinstance(result, list)