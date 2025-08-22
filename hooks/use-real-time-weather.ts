"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { WeatherData } from "@/lib/weather-utils"

interface UseRealTimeWeatherOptions {
  location: string
  coordinates?: { lat: number; lon: number }
  refreshInterval?: number // in milliseconds
  maxRetries?: number
}

interface UseRealTimeWeatherReturn {
  weatherData: WeatherData | null
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
  connectionStatus: "online" | "offline" | "reconnecting"
  retryCount: number
  forceRefresh: () => void
}

export function useRealTimeWeather({
  location,
  coordinates,
  refreshInterval = 300000, // 5 minutes default
  maxRetries = 3,
}: UseRealTimeWeatherOptions): UseRealTimeWeatherReturn {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline" | "reconnecting">("online")
  const [retryCount, setRetryCount] = useState(0)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchWeatherData = useCallback(
    async (isRetry = false) => {
      if (!isRetry) {
        setIsLoading(true)
      } else {
        setConnectionStatus("reconnecting")
      }
      setError(null)

      try {
        let url = ""
        if (coordinates) {
          url = `/api/weather?lat=${coordinates.lat}&lon=${coordinates.lon}`
        } else {
          url = `/api/weather?city=${encodeURIComponent(location)}`
        }

        const response = await fetch(url)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch weather data")
        }

        setWeatherData(data)
        setLastUpdated(new Date())
        setConnectionStatus("online")
        setRetryCount(0)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
        setError(errorMessage)
        setWeatherData(null)

        // Implement retry logic
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1)
          setConnectionStatus("reconnecting")

          // Exponential backoff: 2^retryCount * 1000ms
          const retryDelay = Math.pow(2, retryCount) * 1000
          retryTimeoutRef.current = setTimeout(() => {
            fetchWeatherData(true)
          }, retryDelay)
        } else {
          setConnectionStatus("offline")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [location, coordinates, retryCount, maxRetries],
  )

  const forceRefresh = useCallback(() => {
    setRetryCount(0)
    fetchWeatherData()
  }, [fetchWeatherData])

  // Initial fetch and setup interval
  useEffect(() => {
    fetchWeatherData()

    // Set up auto-refresh interval
    intervalRef.current = setInterval(() => {
      if (connectionStatus !== "offline") {
        fetchWeatherData()
      }
    }, refreshInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [fetchWeatherData, refreshInterval, connectionStatus])

  // Reset retry count when location changes
  useEffect(() => {
    setRetryCount(0)
    setConnectionStatus("online")
  }, [location, coordinates])

  return {
    weatherData,
    isLoading,
    error,
    lastUpdated,
    connectionStatus,
    retryCount,
    forceRefresh,
  }
}
