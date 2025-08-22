"use client"

import type { WeatherData } from "@/lib/weather-utils"

interface WeatherMissionInfoProps {
  weatherData: WeatherData | null
}

export function WeatherMissionInfo({ weatherData }: WeatherMissionInfoProps) {
  const getTemperatureStatus = (temp: number) => {
    if (temp > 30) return { status: "HIGH RISK", color: "text-red-400", count: 150 }
    if (temp > 20) return { status: "MEDIUM RISK", color: "text-yellow-400", count: 420 }
    if (temp > 10) return { status: "LOW RISK", color: "text-green-400", count: 920 }
    return { status: "EXTREME COLD", color: "text-blue-400", count: 180 }
  }

  const getHumidityStatus = (humidity: number) => {
    if (humidity > 80) return { status: "HIGH HUMIDITY", color: "text-red-400", count: 190 }
    if (humidity > 60) return { status: "MODERATE", color: "text-yellow-400", count: 750 }
    return { status: "LOW HUMIDITY", color: "text-green-400", count: 920 }
  }

  const tempStatus = weatherData ? getTemperatureStatus(weatherData.current.temperature) : null
  const humidityStatus = weatherData ? getHumidityStatus(weatherData.current.humidity) : null

  return (
    <div className="tactical-panel h-full">
      <h2 className="tactical-header mb-4">MISSION INFORMATION</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-green-400 text-xs font-bold mb-2">● SUCCESSFUL MISSIONS</h3>
          <div className="space-y-1">
            <div className="flex justify-between tactical-data">
              <span>Temperature Monitoring</span>
              <span className="text-foreground">{tempStatus?.count || 100}</span>
            </div>
            <div className="flex justify-between tactical-data">
              <span>Humidity Tracking</span>
              <span className="text-foreground">{humidityStatus?.count || 420}</span>
            </div>
            <div className="flex justify-between tactical-data">
              <span>Wind Analysis</span>
              <span className="text-foreground">920</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-red-400 text-xs font-bold mb-2">● FAILED MISSIONS</h3>
          <div className="space-y-1">
            <div className="flex justify-between tactical-data">
              <span>Severe Weather Alert</span>
              <span className="text-foreground">150</span>
            </div>
            <div className="flex justify-between tactical-data">
              <span>Storm Prediction</span>
              <span className="text-foreground">250</span>
            </div>
            <div className="flex justify-between tactical-data">
              <span>Pressure Anomaly</span>
              <span className="text-foreground">920</span>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="space-y-2">
            <div className="flex justify-between tactical-data">
              <span>CURRENT THREAT LEVEL:</span>
              <span className={tempStatus?.color || "text-green-400"}>{tempStatus?.status || "NORMAL"}</span>
            </div>
            <div className="flex justify-between tactical-data">
              <span>ATMOSPHERIC STATUS:</span>
              <span className={humidityStatus?.color || "text-green-400"}>{humidityStatus?.status || "STABLE"}</span>
            </div>
            <div className="flex justify-between tactical-data">
              <span>NEXT SCAN:</span>
              <span className="text-primary">00:04:23</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
