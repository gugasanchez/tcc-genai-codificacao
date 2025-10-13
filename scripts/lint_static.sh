#!/usr/bin/env bash
set -e
ruff check app || true
pylint app || true
bandit -r app -q || true
radon cc app -a


