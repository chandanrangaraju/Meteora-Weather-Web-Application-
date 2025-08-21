from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class WeatherData(BaseModel):
    location: str = Field(..., description="Location name")
    temperature: float = Field(..., description="Temperature in Celsius")
    condition: str = Field(..., description="Weather condition description")
    humidity: int = Field(..., ge=0, le=100, description="Humidity percentage")
    wind_speed: float = Field(..., ge=0, description="Wind speed in km/h")
    visibility: float = Field(..., ge=0, description="Visibility in kilometers")
    pressure: float = Field(..., ge=0, description="Atmospheric pressure in hPa")
    feels_like: float = Field(..., description="Feels like temperature in Celsius")
    uv_index: int = Field(..., ge=0, le=11, description="UV index")
    icon: Optional[str] = Field(None, description="Weather icon URL")

class WeatherResponse(BaseModel):
    success: bool = Field(..., description="Request success status")
    data: WeatherData = Field(..., description="Weather data")
    message: Optional[str] = Field(None, description="Optional message")

class ForecastDay(BaseModel):
    day: str = Field(..., description="Day name")
    date: str = Field(..., description="Date in YYYY-MM-DD format")
    max_temp: float = Field(..., description="Maximum temperature in Celsius")
    min_temp: float = Field(..., description="Minimum temperature in Celsius")
    condition: str = Field(..., description="Weather condition description")
    chance_of_rain: int = Field(..., ge=0, le=100, description="Chance of rain percentage")
    icon: Optional[str] = Field(None, description="Weather icon URL")

class ForecastResponse(BaseModel):
    success: bool = Field(..., description="Request success status")
    data: List[ForecastDay] = Field(..., description="Forecast data")
    message: Optional[str] = Field(None, description="Optional message")

class LocationCoordinates(BaseModel):
    lat: float = Field(..., ge=-90, le=90, description="Latitude")
    lon: float = Field(..., ge=-180, le=180, description="Longitude")

class LocationSuggestion(BaseModel):
    name: str = Field(..., description="Location name")
    region: str = Field(..., description="Region/state name")
    country: str = Field(..., description="Country name")
    display_name: str = Field(..., description="Full display name")
    coordinates: LocationCoordinates = Field(..., description="Location coordinates")

class LocationResponse(BaseModel):
    success: bool = Field(..., description="Request success status")
    data: List[LocationSuggestion] = Field(..., description="Location suggestions")
    message: Optional[str] = Field(None, description="Optional message")

class ErrorResponse(BaseModel):
    success: bool = Field(False, description="Request success status")
    error: str = Field(..., description="Error message")
    details: Optional[Dict[str, Any]] = Field(None, description="Additional error details")
