from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # API Configuration
    app_name: str = "Premium Weather API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    
    # CORS Configuration
    allowed_origins: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-frontend-domain.com"
    ]
    
    # Weather API Configuration
    weather_api_key: str = ""
    weather_api_base_url: str = "https://api.weatherapi.com/v1"
    
    # Geocoding API Configuration
    geocoding_api_key: str = ""
    geocoding_api_base_url: str = "https://api.opencagedata.com/geocode/v1"
    
    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600  # 1 hour in seconds
    
    # Cache Configuration
    cache_ttl: int = 300  # 5 minutes in seconds
    
    # Database Configuration (if needed)
    database_url: str = "sqlite:///./weather.db"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Create settings instance
settings = Settings()
