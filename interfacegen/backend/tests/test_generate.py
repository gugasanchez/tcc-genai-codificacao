from app.services import llm_client


def test_generate_direct_persists_without_audits(client, monkeypatch):
    # Mock LLM to return deterministic HTML
    monkeypatch.setattr(llm_client.LLMClient, 'generate_code', lambda self, prompt: '<!doctype html><html><body><h1>Hi</h1></body></html>')

    # Create participant
    p = client.post('/api/participants').json()
    # Generate
    r = client.post('/api/sessions/generate', json={
        'participant_id': p['id'],
        'mode': 'direct',
        'prompt': 'Landing page simples'
    })
    assert r.status_code == 200
    payload = r.json()
    assert 'session_id' in payload and 'code' in payload

    # Fetch session and verify fields
    sid = payload['session_id']
    s = client.get(f'/api/sessions/{sid}')
    assert s.status_code == 200
    data = s.json()
    assert data['generation_time_ms'] is not None


