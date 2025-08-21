# Premium Weather API - FastAPI Backend

A sophisticated weather API backend built with FastAPI, designed to work with the Premium Weather frontend.

## Features

- **Current Weather Data**: Get real-time weather information for any location
- **Weather Forecasts**: 7-14 day weather forecasts with detailed information
- **Location Search**: Geocoding and location suggestion endpoints
- **Geolocation Support**: Weather data by coordinates
- **CORS Enabled**: Ready for frontend integration
- **API Documentation**: Auto-generated OpenAPI/Swagger docs
- **Error Handling**: Comprehensive error responses
- **Rate Limiting**: Built-in request rate limiting
- **Caching**: Configurable response caching

## Quick Start

### 1. Setup Environment

\`\`\`bash
# Make the start script executable
chmod +x start.sh

# Run the setup and start script
./start.sh
\`\`\`

### 2. Manual Setup

\`\`\`bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your API keys

# Start the server
python run_server.py
\`\`\`

### 3. Configuration

Create a `.env` file with your API keys:

\`\`\`env
# Weather API Configuration (WeatherAPI.com)
WEATHER_API_KEY=your_weatherapi_key_here
WEATHER_API_BASE_URL=https://api.weatherapi.com/v1

# Geocoding API Configuration (OpenCage)
GEOCODING_API_KEY=your_opencage_key_here
GEOCODING_API_BASE_URL=https://api.opencagedata.com/geocode/v1

# Server Configuration
DEBUG=true
HOST=0.0.0.0
PORT=8000

# Frontend URLs for CORS
ALLOWED_ORIGINS=["http://localhost:3000","https://your-frontend-domain.com"]
\`\`\`

## API Endpoints

### Weather Endpoints

- `GET /api/weather?location={location}` - Current weather data
- `GET /api/forecast?location={location}&days={days}` - Weather forecast
- `GET /api/weather/coordinates?lat={lat}&lon={lon}` - Weather by coordinates

### Location Endpoints

- `GET /api/locations?q={query}` - Search location suggestions

### System Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation
- `GET /redoc` - Alternative API documentation

## API Keys Required

### WeatherAPI.com (Recommended)
1. Sign up at [WeatherAPI.com](https://www.weatherapi.com/)
2. Get your free API key (1M requests/month)
3. Add to `.env` as `WEATHER_API_KEY`

### OpenCage Geocoding (Optional)
1. Sign up at [OpenCage](https://opencagedata.com/)
2. Get your free API key (2,500 requests/day)
3. Add to `.env` as `GEOCODING_API_KEY`

## Deployment

### Local Development
\`\`\`bash
python run_server.py
\`\`\`

### Production (with Gunicorn)
\`\`\`bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
\`\`\`

### Docker
\`\`\`dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
\`\`\`

## Frontend Integration

Update your Next.js frontend to use this backend:

\`\`\`typescript
// In your Next.js API routes or client code
const API_BASE_URL = 'http://localhost:8000'

// Fetch weather data
const response = await fetch(`${API_BASE_URL}/api/weather?location=${location}`)
const data = await response.json()
\`\`\`

## Architecture

\`\`\`
├── main.py              # FastAPI application and routes
├── models.py            # Pydantic data models
├── config.py            # Configuration settings
├── weather_service.py   # Weather API integration
├── requirements.txt     # Python dependencies
├── run_server.py        # Server startup script
├── start.sh            # Setup and start script
└── README.md           # This file
\`\`\`

## Error Handling

The API returns consistent error responses:

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "details": {
    "additional": "error details"
  }
}
\`\`\`

## Rate Limiting

- Default: 100 requests per hour per IP
- Configurable in `config.py`
- Returns `429 Too Many Requests` when exceeded

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
