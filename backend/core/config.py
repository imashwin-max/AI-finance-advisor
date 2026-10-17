from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./finance_advisor.db"
    GEMINI_API_KEY: str = ""
    JWT_SECRET_KEY: str = "dev-secret-change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: str = "http://localhost:5173,https://ai-finance-advisor-jet.vercel.app"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origins_list(self) -> list[str]:
        origins = []
        for origin in self.CORS_ORIGINS.split(","):
            cleaned = origin.strip().rstrip("/")
            if cleaned and cleaned not in origins:
                origins.append(cleaned)
        for default in [
            "https://ai-finance-advisor-jet.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]:
            if default not in origins:
                origins.append(default)
        return origins


settings = Settings()
