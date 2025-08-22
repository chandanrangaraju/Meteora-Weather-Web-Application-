"use client"

import { useEffect, useState } from "react"

interface DataFreshnessIndicatorProps {
  lastUpdated: Date | null
  maxAge?: number // in seconds
}

export function DataFreshnessIndicator({ lastUpdated, maxAge = 300 }: DataFreshnessIndicatorProps) {
  const [freshness, setFreshness] = useState<"fresh" | "stale" | "expired">("fresh")

  useEffect(() => {
    if (!lastUpdated) {
      setFreshness("expired")
      return
    }

    const updateFreshness = () => {
      const now = new Date()
      const ageInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000)

      if (ageInSeconds < maxAge / 2) {
        setFreshness("fresh")
      } else if (ageInSeconds < maxAge) {
        setFreshness("stale")
      } else {
        setFreshness("expired")
      }
    }

    updateFreshness()
    const interval = setInterval(updateFreshness, 1000)

    return () => clearInterval(interval)
  }, [lastUpdated, maxAge])

  const getIndicatorColor = () => {
    switch (freshness) {
      case "fresh":
        return "bg-green-400"
      case "stale":
        return "bg-yellow-400"
      case "expired":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  const getIndicatorText = () => {
    switch (freshness) {
      case "fresh":
        return "LIVE DATA"
      case "stale":
        return "AGING DATA"
      case "expired":
        return "STALE DATA"
      default:
        return "NO DATA"
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${getIndicatorColor()} ${freshness === "fresh" ? "animate-pulse" : ""}`}
      ></div>
      <span className="text-xs font-mono text-muted-foreground">{getIndicatorText()}</span>
    </div>
  )
}
