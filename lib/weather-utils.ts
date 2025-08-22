export interface WeatherData {
  location: {
    name: string
    country: string
    coordinates: {
      lat: number
      lon: number
    }
  }
  current: {
    temperature: number
    feelsLike: number
    humidity: number
    pressure: number
    visibility: number
    windSpeed: number
    windDirection: number
    condition: string
    description: string
    icon: string
  }
  timestamp: string
  status: "OPERATIONAL" | "OFFLINE"
}

export interface ForecastData {
  location: {
    name: string
    country: string
  }
  forecast: Array<{
    timestamp: string
    temperature: number
    condition: string
    description: string
    humidity: number
    windSpeed: number
    icon: string
  }>
  status: "OPERATIONAL" | "OFFLINE"
}

export const getWeatherConditionCode = (condition: string): string => {
  const conditionMap: Record<string, string> = {
    Clear: "WX-001",
    Clouds: "WX-002",
    Rain: "WX-003",
    Drizzle: "WX-004",
    Thunderstorm: "WX-005",
    Snow: "WX-006",
    Mist: "WX-007",
    Fog: "WX-008",
    Haze: "WX-009",
  }
  return conditionMap[condition] || "WX-000"
}

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp)
    .toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(",", "")
}

export const getWindDirection = (degrees: number): string => {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ]
  return directions[Math.round(degrees / 22.5) % 16]
}
