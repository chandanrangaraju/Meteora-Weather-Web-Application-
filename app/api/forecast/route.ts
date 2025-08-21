import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const location = searchParams.get("location") || "New York"

  // Mock 7-day forecast data
  const days = ["Today", "Tomorrow", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"]

  const mockForecastData = days.map((day, index) => ({
    day,
    date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    maxTemp: Math.floor(Math.random() * 15) + 20,
    minTemp: Math.floor(Math.random() * 10) + 10,
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    chanceOfRain: Math.floor(Math.random() * 80) + 10,
    icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
  }))

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      success: true,
      data: mockForecastData,
    })
  } catch (error) {
    console.error("Forecast API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch forecast data" }, { status: 500 })
  }
}
