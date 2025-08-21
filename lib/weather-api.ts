interface WeatherData {
  location: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
  visibility: number
  pressure: number
  feelsLike: number
  uvIndex: number
  icon?: string
}

interface ForecastDay {
  day: string
  date: string
  maxTemp: number
  minTemp: number
  condition: string
  chanceOfRain: number
  icon?: string
}

export async function fetchWeatherData(location: string): Promise<WeatherData> {
  const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
  const result = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch weather data")
  }

  return result.data
}

export async function fetchForecastData(location: string): Promise<ForecastDay[]> {
  const response = await fetch(`/api/forecast?location=${encodeURIComponent(location)}`)
  const result = await response.json()

  if (!result.success) {
    throw new Error(result.error || "Failed to fetch forecast data")
  }

  return result.data
}
