"use client"

import { useState } from "react"
import { TacticalSidebar } from "@/components/tactical-sidebar"
import { TacticalHeader } from "@/components/tactical-header"
import { DailyForecast } from "@/components/daily-forecast"
import { WeatherForecastChart } from "@/components/weather-forecast-chart"
import { WeatherRadar } from "@/components/weather-radar"
import { DataFreshnessIndicator } from "@/components/data-freshness-indicator"
import { DisasterAlerts } from "@/components/disaster-alerts"
import { useRealTimeWeather } from "@/hooks/use-real-time-weather"
import { EnhancedSystemStatus } from "@/components/enhanced-system-status"

export default function TacticalWeatherDashboard() {
  const [currentLocation, setCurrentLocation] = useState("Bengaluru")
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | undefined>()
  const [activeSection, setActiveSection] = useState<"weather" | "alerts" | "systems">("weather")

  const { weatherData, isLoading, error, lastUpdated, connectionStatus, retryCount, forceRefresh } = useRealTimeWeather(
    {
      location: currentLocation,
      coordinates,
      refreshInterval: 300000, // 5 minutes
      maxRetries: 3,
    },
  )

  const handleLocationChange = (location: string, coords?: { lat: number; lon: number }) => {
    setCurrentLocation(location)
    setCoordinates(coords)
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <TacticalSidebar
        currentLocation={currentLocation}
        onLocationChange={handleLocationChange}
        connectionStatus={connectionStatus}
        lastUpdated={lastUpdated}
        retryCount={retryCount}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col">
        <TacticalHeader
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
          onRefresh={forceRefresh}
          isLoading={isLoading}
        />

        <main className="flex-1 p-6 overflow-auto">
          {activeSection === "weather" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <div className="tactical-panel">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="tactical-header">WEATHER STATUS</h2>
                  <DataFreshnessIndicator lastUpdated={lastUpdated} />
                </div>
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-primary">ACQUIRING TARGET DATA...</div>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-red-400">ERROR: {error}</div>
                  </div>
                ) : weatherData ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="tactical-data">LOCATION:</span>
                      <span className="text-primary">
                        {weatherData.location.name}, {weatherData.location.country}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="tactical-data">STATUS:</span>
                      <span
                        className={
                          weatherData.status === "OPERATIONAL" ? "tactical-status-online" : "tactical-status-offline"
                        }
                      >
                        {weatherData.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="tactical-data">CONDITION:</span>
                      <span className="text-foreground">{weatherData.current.condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="tactical-data">TEMPERATURE:</span>
                      <span className="text-primary text-lg font-bold">{weatherData.current.temperature}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="tactical-data">FEELS LIKE:</span>
                      <span className="text-foreground">{weatherData.current.feelsLike}°C</span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="tactical-panel">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="tactical-header">ENVIRONMENTAL DATA</h2>
                  <DataFreshnessIndicator lastUpdated={lastUpdated} maxAge={180} />
                </div>
                {weatherData && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="tactical-data">HUMIDITY:</span>
                      <span className="text-foreground">{weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="tactical-data">PRESSURE:</span>
                      <span className="text-foreground">{weatherData.current.pressure} hPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="tactical-data">VISIBILITY:</span>
                      <span className="text-foreground">{weatherData.current.visibility} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="tactical-data">WIND SPEED:</span>
                      <span className="text-foreground">{weatherData.current.windSpeed} km/h</span>
                    </div>
                  </div>
                )}
              </div>

              <WeatherRadar weatherData={weatherData} />

              <DailyForecast currentLocation={currentLocation} />

              <div className="lg:col-span-2">
                <WeatherForecastChart currentLocation={currentLocation} />
              </div>
            </div>
          )}

          {activeSection === "alerts" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              <DisasterAlerts currentLocation={currentLocation} />

              <div className="tactical-panel">
                <h2 className="tactical-header mb-4">ALERT CONFIGURATION</h2>
                <div className="space-y-3">
                  <div className="flex justify-between tactical-data">
                    <span>EARTHQUAKE MONITORING:</span>
                    <span className="text-green-400">ACTIVE</span>
                  </div>
                  <div className="flex justify-between tactical-data">
                    <span>TSUNAMI WATCH:</span>
                    <span className="text-green-400">ACTIVE</span>
                  </div>
                  <div className="flex justify-between tactical-data">
                    <span>FLOOD DETECTION:</span>
                    <span className="text-green-400">ACTIVE</span>
                  </div>
                  <div className="flex justify-between tactical-data">
                    <span>CYCLONE TRACKING:</span>
                    <span className="text-green-400">ACTIVE</span>
                  </div>
                  <div className="flex justify-between tactical-data">
                    <span>LANDSLIDE RISK:</span>
                    <span className="text-green-400">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "systems" && (
            <div className="h-full">
              <EnhancedSystemStatus />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
