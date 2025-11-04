from fastapi.testclient import TestClient


def test_post_likert_feedback_and_export(client: TestClient):
    # create participant
    pr = client.post("/api/participants")
    assert pr.status_code == 200
    pid = pr.json()["id"]

    # generate a direct session
    gr = client.post(
        "/api/sessions/generate",
        json={
            "participant_id": pid,
            "mode": "direct",
            "prompt": "<div>test</div>",
        },
    )
    assert gr.status_code == 200
    session_id = gr.json()["session_id"]

    # send feedback (Likert)
    payload = {
        "session_id": session_id,
        "answers": {
            "usability": [5, 4, 3, 2, 1],
            "cognitive_load": [1, 2, 3, 4, 5],  # items 1 and 3 are inverted in scoring
            "perceived_quality": [3, 3, 3, 3, 3],
        },
        "comments": "ok",
    }
    fr = client.post("/api/feedback", json=payload)
    assert fr.status_code == 200, fr.text
    assert fr.json().get("ok") is True

    # export and verify sums and raw answers
    er = client.get("/api/export/json")
    assert er.status_code == 200
    data = er.json()
    # find the session entry
    entry = next((x for x in data if x["id"] == session_id), None)
    assert entry is not None
    fb = entry.get("feedback")
    assert fb is not None
    assert fb["answers"]["usability"] == [5, 4, 3, 2, 1]
    assert fb["answers"]["cognitive_load"] == [1, 2, 3, 4, 5]
    assert fb["answers"]["perceived_quality"] == [3, 3, 3, 3, 3]

    # sums (no inversion; questions are positively phrased): u=15, c=15, q=15, overall=15
    assert fb["usability_score"] == 15
    assert fb["cognitive_score"] == 15
    assert fb["quality_score"] == 15
    assert fb["overall_score"] == 15


