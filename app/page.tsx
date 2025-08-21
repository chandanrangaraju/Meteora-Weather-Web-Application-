"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Droplets, Wind, Eye, Gauge, Sun, Cloud, CloudRain, Loader2 } from "lucide-react"
import { fetchWeatherData, fetchForecastData } from "@/lib/weather-api"
import { LocationSearch } from "@/components/location-search"
import { WeatherCharts } from "@/components/weather-charts"

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

export default function WeatherApp() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastDay[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadWeatherData("New York")
  }, [])

  const loadWeatherData = async (location: string) => {
    setLoading(true)
    setError(null)

    try {
      const [weatherData, forecastData] = await Promise.all([fetchWeatherData(location), fetchForecastData(location)])

      setCurrentWeather(weatherData)
      setForecast(forecastData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weather data")
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
      case "clear":
        return <Sun className="h-8 w-8 text-primary" />
      case "partly cloudy":
      case "cloudy":
        return <Cloud className="h-8 w-8 text-muted-foreground" />
      case "light rain":
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />
      default:
        return <Sun className="h-8 w-8 text-primary" />
    }
  }

  if (loading && !currentWeather) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="font-serif text-lg">Loading weather data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="font-sans text-4xl md:text-6xl font-bold text-foreground">Premium Weather</h1>
          <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience sophisticated weather forecasting with elegant design and precise data
          </p>
        </header>

        <LocationSearch onLocationSelect={loadWeatherData} loading={loading} />

        {error && (
          <Card className="glass border-0 shadow-2xl">
            <CardContent className="p-6">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive font-serif">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {currentWeather && (
          <Card className="glass border-0 shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle className="font-sans text-2xl">{currentWeather.location}</CardTitle>
                </div>
                <Badge variant="secondary" className="font-serif">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getWeatherIcon(currentWeather.condition)}
                  <div>
                    <div className="text-5xl font-bold font-sans text-foreground">{currentWeather.temperature}°C</div>
                    <div className="text-lg text-muted-foreground font-serif">{currentWeather.condition}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground font-serif">Feels like</div>
                  <div className="text-2xl font-semibold font-sans">{currentWeather.feelsLike}°C</div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground font-serif">Humidity</div>
                    <div className="font-semibold font-sans">{currentWeather.humidity}%</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Wind className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-sm text-muted-foreground font-serif">Wind Speed</div>
                    <div className="font-semibold font-sans">{currentWeather.windSpeed} km/h</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-sm text-muted-foreground font-serif">Visibility</div>
                    <div className="font-semibold font-sans">{currentWeather.visibility} km</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                  <Gauge className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-sm text-muted-foreground font-serif">Pressure</div>
                    <div className="font-semibold font-sans">{currentWeather.pressure} hPa</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentWeather && forecast.length > 0 && <WeatherCharts forecast={forecast} currentWeather={currentWeather} />}

        {forecast.length > 0 && (
          <Card className="glass border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="font-sans text-2xl">7-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {forecast.map((day, index) => (
                  <div
                    key={day.date}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="font-serif text-sm w-20">{day.day}</div>
                      {getWeatherIcon(day.condition)}
                      <div className="font-serif text-sm text-muted-foreground">{day.condition}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground font-serif">
                        {day.minTemp}° / {day.maxTemp}°
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-serif">{day.chanceOfRain}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
