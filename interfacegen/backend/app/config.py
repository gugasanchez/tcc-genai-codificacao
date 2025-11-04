import os
from functools import lru_cache


class Settings:
    database_url: str
    openai_api_key: str | None
    llm_model: str
    llm_temperature: float
    cors_allow_all: bool

    def __init__(self) -> None:
        self.database_url = os.getenv("DATABASE_URL", "postgresql+psycopg2://interfacegen:interfacegen@db:5432/interfacegen")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.llm_model = os.getenv("LLM_MODEL", "gpt-4o")
        self.llm_temperature = float(os.getenv("LLM_TEMPERATURE", "0.7"))
        self.cors_allow_all = os.getenv("CORS_ALLOW_ALL", "false").lower() in ("1", "true", "yes")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


