#!/bin/bash

# Start script for the Premium Weather API

echo "Starting Premium Weather API..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOL
# Weather API Configuration
WEATHER_API_KEY=your_weatherapi_key_here
WEATHER_API_BASE_URL=https://api.weatherapi.com/v1

# Geocoding API Configuration  
GEOCODING_API_KEY=your_opencage_key_here
GEOCODING_API_BASE_URL=https://api.opencagedata.com/geocode/v1

# Server Configuration
DEBUG=true
HOST=0.0.0.0
PORT=8000

# CORS Configuration
ALLOWED_ORIGINS=["http://localhost:3000","https://your-frontend-domain.com"]
EOL
    echo "Please update the .env file with your API keys"
fi

# Start the server
echo "Starting server..."
python run_server.py
