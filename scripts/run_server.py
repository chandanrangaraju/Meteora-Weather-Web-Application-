#!/usr/bin/env python3
"""
Script to run the FastAPI weather server.
Usage: python run_server.py
"""

import uvicorn
from main import app
from config import settings

if __name__ == "__main__":
    print(f"Starting {settings.app_name} v{settings.app_version}")
    print(f"Server will be available at: http://{settings.host}:{settings.port}")
    print(f"API documentation: http://{settings.host}:{settings.port}/docs")
    print(f"Debug mode: {settings.debug}")
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info" if not settings.debug else "debug"
    )
