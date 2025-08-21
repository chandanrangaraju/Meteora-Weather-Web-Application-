from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import os
from dotenv import load_dotenv
from typing import List, Optional
import asyncio
from datetime import datetime, timedelta

from models import WeatherResponse, ForecastResponse, LocationResponse, LocationSuggestion
from config import settings

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Premium Weather API",
    description="A sophisticated weather API backend built with FastAPI",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Weather API client
async def get_weather_client():
    return httpx.AsyncClient(timeout=30.0)

@app.get("/")
async def root():
    return {"message": "Premium Weather API", "version": "1.0.0", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/api/weather", response_model=WeatherResponse)
async def get_current_weather(
    location: str = Query(..., description="Location name or coordinates (lat,lon)")
):
    """
    Get current weather data for a specific location.
    
    Args:
        location: City name, address, or coordinates in format "lat,lon"
    
    Returns:
        Current weather data including temperature, conditions, and metrics
    """
    try:
        async with httpx.AsyncClient() as client:
            # In production, replace with actual weather API
            # Example: OpenWeatherMap, WeatherAPI, etc.
            
            # Mock data for demonstration
            import random
            
            weather_data = {
                "location": location if "," not in location else f"Location at {location}",
                "temperature": random.randint(10, 35),
                "condition": random.choice(["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"]),
                "humidity": random.randint(40, 80),
                "wind_speed": random.randint(5, 25),
                "visibility": random.randint(5, 15),
                "pressure": random.randint(1000, 1050),
                "feels_like": random.randint(12, 38),
                "uv_index": random.randint(1, 10),
                "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
            }
            
            return WeatherResponse(
                success=True,
                data=weather_data
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather data: {str(e)}")

@app.get("/api/forecast", response_model=ForecastResponse)
async def get_weather_forecast(
    location: str = Query(..., description="Location name or coordinates (lat,lon)"),
    days: int = Query(7, ge=1, le=14, description="Number of forecast days")
):
    """
    Get weather forecast for a specific location.
    
    Args:
        location: City name, address, or coordinates in format "lat,lon"
        days: Number of forecast days (1-14)
    
    Returns:
        Weather forecast data for the specified number of days
    """
    try:
        async with httpx.AsyncClient() as client:
            # Mock forecast data for demonstration
            import random
            from datetime import datetime, timedelta
            
            forecast_data = []
            day_names = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"]
            
            for i in range(days):
                date = datetime.now() + timedelta(days=i)
                forecast_data.append({
                    "day": day_names[i] if i < len(day_names) else date.strftime("%A"),
                    "date": date.strftime("%Y-%m-%d"),
                    "max_temp": random.randint(20, 35),
                    "min_temp": random.randint(10, 20),
                    "condition": random.choice(conditions),
                    "chance_of_rain": random.randint(10, 90),
                    "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
                })
            
            return ForecastResponse(
                success=True,
                data=forecast_data
            )
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch forecast data: {str(e)}")

@app.get("/api/locations", response_model=LocationResponse)
async def search_locations(
    q: str = Query(..., min_length=2, description="Search query for locations")
):
    """
    Search for location suggestions based on query.
    
    Args:
        q: Search query (minimum 2 characters)
    
    Returns:
        List of location suggestions with coordinates
    """
    try:
        # Mock location data for demonstration
        # In production, use a geocoding service like Google Maps, Mapbox, or OpenCage
        
        mock_locations = [
            {"name": "New York", "region": "New York", "country": "United States", "lat": 40.7128, "lon": -74.0060},
            {"name": "London", "region": "England", "country": "United Kingdom", "lat": 51.5074, "lon": -0.1278},
            {"name": "Tokyo", "region": "Tokyo", "country": "Japan", "lat": 35.6762, "lon": 139.6503},
            {"name": "Paris", "region": "Île-de-France", "country": "France", "lat": 48.8566, "lon": 2.3522},
            {"name": "Sydney", "region": "New South Wales", "country": "Australia", "lat": -33.8688, "lon": 151.2093},
            {"name": "Toronto", "region": "Ontario", "country": "Canada", "lat": 43.6532, "lon": -79.3832},
            {"name": "Berlin", "region": "Berlin", "country": "Germany", "lat": 52.5200, "lon": 13.4050},
            {"name": "Mumbai", "region": "Maharashtra", "country": "India", "lat": 19.0760, "lon": 72.8777},
            {"name": "São Paulo", "region": "São Paulo", "country": "Brazil", "lat": -23.5505, "lon": -46.6333},
            {"name": "Dubai", "region": "Dubai", "country": "United Arab Emirates", "lat": 25.2048, "lon": 55.2708},
        ]
        
        # Filter locations based on query
        filtered_locations = [
            LocationSuggestion(
                name=loc["name"],
                region=loc["region"],
                country=loc["country"],
                display_name=f"{loc['name']}, {loc['region']}, {loc['country']}",
                coordinates={"lat": loc["lat"], "lon": loc["lon"]}
            )
            for loc in mock_locations
            if q.lower() in loc["name"].lower() or 
               q.lower() in loc["region"].lower() or 
               q.lower() in loc["country"].lower()
        ][:5]  # Limit to 5 results
        
        return LocationResponse(
            success=True,
            data=filtered_locations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search locations: {str(e)}")

@app.get("/api/weather/coordinates")
async def get_weather_by_coordinates(
    lat: float = Query(..., ge=-90, le=90, description="Latitude"),
    lon: float = Query(..., ge=-180, le=180, description="Longitude")
):
    """
    Get weather data by coordinates (for geolocation).
    
    Args:
        lat: Latitude (-90 to 90)
        lon: Longitude (-180 to 180)
    
    Returns:
        Current weather data for the specified coordinates
    """
    location = f"{lat},{lon}"
    return await get_current_weather(location=location)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
