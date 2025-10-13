.PHONY: setup test lint bandit metrics run api

setup:
	python -m pip install -e .

test:
	pytest -q

lint:
	ruff check app
	pylint app || true

bandit:
	bandit -r app -q || true

metrics:
	python evaluate/collect_metrics.py

api:
	uvicorn app.main:app --reload


