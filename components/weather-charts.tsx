"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Droplets, Wind, Thermometer } from "lucide-react"

interface ForecastDay {
  day: string
  date: string
  maxTemp: number
  minTemp: number
  condition: string
  chanceOfRain: number
  icon?: string
}

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

interface WeatherChartsProps {
  forecast: ForecastDay[]
  currentWeather: WeatherData
}

export function WeatherCharts({ forecast, currentWeather }: WeatherChartsProps) {
  // Prepare temperature trend data
  const temperatureData = forecast.map((day, index) => ({
    day: day.day,
    maxTemp: day.maxTemp,
    minTemp: day.minTemp,
    avgTemp: Math.round((day.maxTemp + day.minTemp) / 2),
    date: day.date,
  }))

  // Prepare precipitation data
  const precipitationData = forecast.map((day) => ({
    day: day.day,
    chanceOfRain: day.chanceOfRain,
    date: day.date,
  }))

  // Prepare hourly temperature simulation (mock data for demonstration)
  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    const baseTemp = currentWeather.temperature
    const variation = Math.sin(((i - 12) * Math.PI) / 12) * 8
    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      temperature: Math.round(baseTemp + variation),
      humidity: Math.max(30, Math.min(90, currentWeather.humidity + Math.random() * 20 - 10)),
      windSpeed: Math.max(0, currentWeather.windSpeed + Math.random() * 10 - 5),
    }
  })

  // Weather conditions distribution
  const conditionCounts = forecast.reduce(
    (acc, day) => {
      acc[day.condition] = (acc[day.condition] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const conditionData = Object.entries(conditionCounts).map(([condition, count]) => ({
    condition,
    count,
    percentage: Math.round((count / forecast.length) * 100),
  }))

  const CONDITION_COLORS = {
    Sunny: "#f97316",
    Clear: "#f97316",
    "Partly Cloudy": "#6b7280",
    Cloudy: "#4b5563",
    "Light Rain": "#3b82f6",
    Rainy: "#1d4ed8",
  }

  const chartConfig = {
    maxTemp: {
      label: "Max Temperature",
      color: "#f97316",
    },
    minTemp: {
      label: "Min Temperature",
      color: "#ea580c",
    },
    avgTemp: {
      label: "Average Temperature",
      color: "#d97706",
    },
    chanceOfRain: {
      label: "Chance of Rain",
      color: "#3b82f6",
    },
    temperature: {
      label: "Temperature",
      color: "#f97316",
    },
    humidity: {
      label: "Humidity",
      color: "#3b82f6",
    },
    windSpeed: {
      label: "Wind Speed",
      color: "#10b981",
    },
  }

  return (
    <div className="space-y-8">
      {/* Temperature Trend Chart */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <CardTitle className="font-sans text-xl">Temperature Trend</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temperatureData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs font-serif" />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-serif"
                  label={{ value: "°C", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="maxTemp" stroke="#f97316" strokeWidth={2} fill="url(#tempGradient)" />
                <Line type="monotone" dataKey="minTemp" stroke="#ea580c" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Precipitation Chart */}
        <Card className="glass border-0 shadow-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              <CardTitle className="font-sans text-xl">Precipitation Forecast</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={precipitationData}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} className="text-xs font-serif" />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-xs font-serif"
                    label={{ value: "%", angle: -90, position: "insideLeft" }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="chanceOfRain" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weather Conditions Distribution */}
        <Card className="glass border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="font-sans text-xl">Weather Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {conditionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CONDITION_COLORS[entry.condition as keyof typeof CONDITION_COLORS] || "#6b7280"}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="glass p-3 rounded-lg border-0 shadow-lg">
                            <p className="font-serif text-sm">{data.condition}</p>
                            <p className="font-sans text-lg font-semibold">{data.percentage}%</p>
                            <p className="font-serif text-xs text-muted-foreground">{data.count} days</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="mt-4 space-y-2">
              {conditionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: CONDITION_COLORS[item.condition as keyof typeof CONDITION_COLORS] || "#6b7280",
                      }}
                    />
                    <span className="font-serif">{item.condition}</span>
                  </div>
                  <span className="font-sans font-semibold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 24-Hour Forecast */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="font-sans text-xl">24-Hour Forecast</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} className="text-xs font-serif" interval={3} />
                <YAxis
                  yAxisId="temp"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-serif"
                  label={{ value: "°C", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="humidity"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-serif"
                  label={{ value: "%", angle: 90, position: "insideRight" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#f97316", strokeWidth: 2 }}
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Wind Speed Chart */}
      <Card className="glass border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-green-500" />
            <CardTitle className="font-sans text-xl">Wind Speed Forecast</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData.filter((_, i) => i % 3 === 0)}>
                <defs>
                  <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} className="text-xs font-serif" />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  className="text-xs font-serif"
                  label={{ value: "km/h", angle: -90, position: "insideLeft" }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="windSpeed" stroke="#10b981" strokeWidth={2} fill="url(#windGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
