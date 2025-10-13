from app.core.logic import score_value


def test_score_regular():
    assert score_value(3, 4) == 10


def test_score_zero_on_negative():
    assert score_value(-1, 5) == 0
    assert score_value(2, -2) == 0


