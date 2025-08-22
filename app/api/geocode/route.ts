import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Geocoding API key not configured" }, { status: 500 })
    }

    let url = ""
    if (lat && lon) {
      // Reverse geocoding
      url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
    } else if (query) {
      // Forward geocoding
      url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
    } else {
      return NextResponse.json({ error: "Query or coordinates required" }, { status: 400 })
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Geocoding request failed")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Geocoding API error:", error)
    return NextResponse.json({ error: "Failed to geocode location" }, { status: 500 })
  }
}
