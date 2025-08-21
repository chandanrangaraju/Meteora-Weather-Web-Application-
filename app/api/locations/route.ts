import { type NextRequest, NextResponse } from "next/server"

interface LocationSuggestion {
  name: string
  region: string
  country: string
  lat: number
  lon: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, data: [] })
  }

  // Mock location suggestions - in production, use a real geocoding API
  const mockLocations: LocationSuggestion[] = [
    { name: "New York", region: "New York", country: "United States", lat: 40.7128, lon: -74.006 },
    { name: "London", region: "England", country: "United Kingdom", lat: 51.5074, lon: -0.1278 },
    { name: "Tokyo", region: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
    { name: "Paris", region: "Île-de-France", country: "France", lat: 48.8566, lon: 2.3522 },
    { name: "Sydney", region: "New South Wales", country: "Australia", lat: -33.8688, lon: 151.2093 },
    { name: "Toronto", region: "Ontario", country: "Canada", lat: 43.6532, lon: -79.3832 },
    { name: "Berlin", region: "Berlin", country: "Germany", lat: 52.52, lon: 13.405 },
    { name: "Mumbai", region: "Maharashtra", country: "India", lat: 19.076, lon: 72.8777 },
    { name: "São Paulo", region: "São Paulo", country: "Brazil", lat: -23.5505, lon: -46.6333 },
    { name: "Dubai", region: "Dubai", country: "United Arab Emirates", lat: 25.2048, lon: 55.2708 },
  ]

  const filteredLocations = mockLocations
    .filter(
      (location) =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.region.toLowerCase().includes(query.toLowerCase()) ||
        location.country.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 5)

  try {
    await new Promise((resolve) => setTimeout(resolve, 200))

    return NextResponse.json({
      success: true,
      data: filteredLocations.map((loc) => ({
        name: loc.name,
        region: loc.region,
        country: loc.country,
        displayName: `${loc.name}, ${loc.region}, ${loc.country}`,
        coordinates: { lat: loc.lat, lon: loc.lon },
      })),
    })
  } catch (error) {
    console.error("Location search error:", error)
    return NextResponse.json({ success: false, error: "Failed to search locations" }, { status: 500 })
  }
}
