"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts"

interface WeatherForecastChartProps {
  currentLocation: string
}

export function WeatherForecastChart({ currentLocation }: WeatherForecastChartProps) {
  const [forecastData, setForecastData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/forecast?city=${encodeURIComponent(currentLocation)}`)
        const data = await response.json()
        if (response.ok) {
          setForecastData(data)
        }
      } catch (error) {
        console.error("Failed to fetch forecast:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchForecast()
  }, [currentLocation])

  const chartData = (() => {
    if (!forecastData?.data?.list) return []

    return forecastData.data.list.slice(0, 8).map((item: any, index: number) => ({
      time: new Date(item.dt * 1000).getHours() + ":00",
      temperature: Math.round(item.main.temp),
      humidity: item.main.humidity,
    }))
  })()

  return (
    <div className="tactical-panel h-full">
      <h2 className="tactical-header mb-4">WEATHER FORECAST OVERVIEW</h2>
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-primary">ANALYZING WEATHER PATTERNS...</div>
        </div>
      ) : chartData.length > 0 ? (
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ fill: "#f97316", strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="humidity"
                stroke="#10b981"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-400">NO FORECAST DATA AVAILABLE</div>
        </div>
      )}
      <div className="mt-4 flex justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-primary"></div>
          <span className="tactical-data">TEMPERATURE (°C)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-green-400 border-dashed"></div>
          <span className="tactical-data">HUMIDITY (%)</span>
        </div>
      </div>
    </div>
  )
}
