import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location") || searchParams.get("city") || "Bengaluru"
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Weather API key not configured" }, { status: 500 })
    }

    let url = ""
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Forecast data not found")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data: {
        list: data.list,
        city: data.city,
      },
    })
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch forecast data",
      },
      { status: 500 },
    )
  }
}
