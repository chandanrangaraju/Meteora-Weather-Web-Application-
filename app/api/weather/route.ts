import { type NextRequest, NextResponse } from "next/server"

interface WeatherAPIResponse {
  location: {
    name: string
    region: string
    country: string
  }
  current: {
    temp_c: number
    condition: {
      text: string
      icon: string
    }
    humidity: number
    wind_kph: number
    vis_km: number
    pressure_mb: number
    feelslike_c: number
    uv: number
  }
}

interface ForecastAPIResponse {
  forecast: {
    forecastday: Array<{
      date: string
      day: {
        maxtemp_c: number
        mintemp_c: number
        condition: {
          text: string
          icon: string
        }
        daily_chance_of_rain: number
      }
    }>
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location") || "New York"

  // For demo purposes, we'll use a mock API response
  // In production, you would use a real weather API like OpenWeatherMap or WeatherAPI
  const mockWeatherData = {
    location: {
      name: location,
      region: "NY",
      country: "United States",
    },
    current: {
      temp_c: Math.floor(Math.random() * 30) + 10,
      condition: {
        text: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)],
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
      },
      humidity: Math.floor(Math.random() * 40) + 40,
      wind_kph: Math.floor(Math.random() * 20) + 5,
      vis_km: Math.floor(Math.random() * 10) + 5,
      pressure_mb: Math.floor(Math.random() * 50) + 1000,
      feelslike_c: Math.floor(Math.random() * 35) + 10,
      uv: Math.floor(Math.random() * 10) + 1,
    },
  }

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      data: {
        location: `${mockWeatherData.location.name}, ${mockWeatherData.location.region}`,
        temperature: mockWeatherData.current.temp_c,
        condition: mockWeatherData.current.condition.text,
        humidity: mockWeatherData.current.humidity,
        windSpeed: mockWeatherData.current.wind_kph,
        visibility: mockWeatherData.current.vis_km,
        pressure: mockWeatherData.current.pressure_mb,
        feelsLike: mockWeatherData.current.feelslike_c,
        uvIndex: mockWeatherData.current.uv,
        icon: mockWeatherData.current.condition.icon,
      },
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch weather data" }, { status: 500 })
  }
}
