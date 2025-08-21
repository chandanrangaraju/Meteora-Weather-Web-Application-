import httpx
import asyncio
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import json
from config import settings

class WeatherService:
    """
    Service class for interacting with external weather APIs.
    This example shows how to integrate with WeatherAPI.com
    """
    
    def __init__(self):
        self.api_key = settings.weather_api_key
        self.base_url = settings.weather_api_base_url
        self.client = None
    
    async def __aenter__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.aclose()
    
    async def get_current_weather(self, location: str) -> Dict[str, Any]:
        """
        Get current weather data from WeatherAPI.com
        
        Args:
            location: Location query (city name, coordinates, etc.)
        
        Returns:
            Dictionary containing weather data
        """
        if not self.api_key:
            # Return mock data if no API key is configured
            return self._get_mock_weather_data(location)
        
        try:
            url = f"{self.base_url}/current.json"
            params = {
                "key": self.api_key,
                "q": location,
                "aqi": "no"
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Transform API response to our format
            return {
                "location": f"{data['location']['name']}, {data['location']['region']}",
                "temperature": data['current']['temp_c'],
                "condition": data['current']['condition']['text'],
                "humidity": data['current']['humidity'],
                "wind_speed": data['current']['wind_kph'],
                "visibility": data['current']['vis_km'],
                "pressure": data['current']['pressure_mb'],
                "feels_like": data['current']['feelslike_c'],
                "uv_index": data['current']['uv'],
                "icon": data['current']['condition']['icon']
            }
            
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 400:
                raise ValueError(f"Invalid location: {location}")
            elif e.response.status_code == 401:
                raise ValueError("Invalid API key")
            else:
                raise ValueError(f"Weather API error: {e.response.status_code}")
        except Exception as e:
            raise ValueError(f"Failed to fetch weather data: {str(e)}")
    
    async def get_forecast(self, location: str, days: int = 7) -> list:
        """
        Get weather forecast from WeatherAPI.com
        
        Args:
            location: Location query
            days: Number of forecast days (1-10)
        
        Returns:
            List of forecast data
        """
        if not self.api_key:
            # Return mock data if no API key is configured
            return self._get_mock_forecast_data(days)
        
        try:
            url = f"{self.base_url}/forecast.json"
            params = {
                "key": self.api_key,
                "q": location,
                "days": min(days, 10),  # API limit is 10 days
                "aqi": "no",
                "alerts": "no"
            }
            
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            # Transform API response to our format
            forecast_data = []
            day_names = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            
            for i, day_data in enumerate(data['forecast']['forecastday']):
                date_obj = datetime.strptime(day_data['date'], '%Y-%m-%d')
                
                forecast_data.append({
                    "day": day_names[i] if i < len(day_names) else date_obj.strftime("%A"),
                    "date": day_data['date'],
                    "max_temp": day_data['day']['maxtemp_c'],
                    "min_temp": day_data['day']['mintemp_c'],
                    "condition": day_data['day']['condition']['text'],
                    "chance_of_rain": day_data['day']['daily_chance_of_rain'],
                    "icon": day_data['day']['condition']['icon']
                })
            
            return forecast_data
            
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 400:
                raise ValueError(f"Invalid location: {location}")
            elif e.response.status_code == 401:
                raise ValueError("Invalid API key")
            else:
                raise ValueError(f"Weather API error: {e.response.status_code}")
        except Exception as e:
            raise ValueError(f"Failed to fetch forecast data: {str(e)}")
    
    def _get_mock_weather_data(self, location: str) -> Dict[str, Any]:
        """Generate mock weather data for testing"""
        import random
        
        return {
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
    
    def _get_mock_forecast_data(self, days: int) -> list:
        """Generate mock forecast data for testing"""
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
        
        return forecast_data
