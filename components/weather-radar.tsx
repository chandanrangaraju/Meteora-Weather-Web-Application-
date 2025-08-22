"use client"

import { useEffect, useState } from "react"
import type { WeatherData } from "@/lib/weather-utils"
import { getWindDirection } from "@/lib/weather-utils"

interface WeatherRadarProps {
  weatherData: WeatherData | null
}

export function WeatherRadar({ weatherData }: WeatherRadarProps) {
  const [radarData, setRadarData] = useState<Array<{ angle: number; intensity: number }>>([])

  useEffect(() => {
    // Generate simulated radar data based on weather conditions
    const generateRadarData = () => {
      const data = []
      for (let i = 0; i < 360; i += 10) {
        const baseIntensity = weatherData?.current.humidity || 50
        const windEffect = weatherData?.current.windDirection || 0
        const distanceFromWind = Math.abs(i - windEffect)
        const windInfluence = Math.max(0, 100 - distanceFromWind) / 100

        const intensity = (baseIntensity + windInfluence * 30 + Math.random() * 20) / 100
        data.push({ angle: i, intensity: Math.min(intensity, 1) })
      }
      setRadarData(data)
    }

    generateRadarData()
    const interval = setInterval(generateRadarData, 5000)
    return () => clearInterval(interval)
  }, [weatherData])

  const windDirection = weatherData?.current.windDirection || 0
  const windDirectionText = getWindDirection(windDirection)

  return (
    <div className="tactical-panel h-full">
      <h2 className="tactical-header mb-4">WEATHER RADAR ACTIVITY</h2>
      <div className="flex items-center justify-center h-64 relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Radar circles */}
          <circle cx="100" cy="100" r="80" fill="none" stroke="#374151" strokeWidth="1" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="#374151" strokeWidth="1" />
          <circle cx="100" cy="100" r="40" fill="none" stroke="#374151" strokeWidth="1" />
          <circle cx="100" cy="100" r="20" fill="none" stroke="#374151" strokeWidth="1" />

          {/* Radar grid lines */}
          <line x1="100" y1="20" x2="100" y2="180" stroke="#374151" strokeWidth="1" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="#374151" strokeWidth="1" />

          {/* Radar data points */}
          {radarData.map((point, index) => {
            const angle = (point.angle * Math.PI) / 180
            const radius = 20 + point.intensity * 60
            const x = 100 + Math.cos(angle) * radius
            const y = 100 + Math.sin(angle) * radius

            return <circle key={index} cx={x} cy={y} r="1.5" fill="#10b981" opacity={point.intensity} />
          })}

          {/* Wind direction indicator */}
          <line
            x1="100"
            y1="100"
            x2={100 + Math.cos((windDirection * Math.PI) / 180) * 70}
            y2={100 + Math.sin((windDirection * Math.PI) / 180) * 70}
            stroke="#f97316"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />

          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#f97316" />
            </marker>
          </defs>
        </svg>

        {/* Center dot */}
        <div className="absolute w-2 h-2 bg-primary rounded-full"></div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between tactical-data">
          <span>WIND DIRECTION:</span>
          <span className="text-primary">
            {windDirectionText} ({windDirection}°)
          </span>
        </div>
        <div className="flex justify-between tactical-data">
          <span>SCAN RATE:</span>
          <span className="text-green-400">2.4 RPM</span>
        </div>
        <div className="flex justify-between tactical-data">
          <span>SIGNAL STRENGTH:</span>
          <span className="text-green-400">98.7%</span>
        </div>
      </div>
    </div>
  )
}
