import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const city = searchParams.get("city") || "Bengaluru"
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  try {
    // Using OpenWeatherMap API - users will need to add their API key
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 })
    }

    let url = ""
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Weather data not found")
    }

    const data = await response.json()

    // Transform the data to match our tactical theme
    const weatherData = {
      location: {
        name: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon,
        },
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        visibility: Math.round(data.visibility / 1000), // Convert to km
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert to km/h
        windDirection: data.wind.deg,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
      },
      timestamp: new Date().toISOString(),
      status: "OPERATIONAL",
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data", status: "OFFLINE" }, { status: 500 })
  }
}
