def test_participant_start_mode_balancing(client):
    r1 = client.post('/api/participants')
    r2 = client.post('/api/participants')
    assert r1.status_code == 200 and r2.status_code == 200
    m1 = r1.json()['start_mode']
    m2 = r2.json()['start_mode']
    assert m1 in ('direct', 'wizard')
    assert m2 in ('direct', 'wizard')
    assert m1 != m2  # alternância simples


