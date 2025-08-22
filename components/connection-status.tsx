"use client"

import { Wifi, WifiOff, RotateCcw } from "lucide-react"

interface ConnectionStatusProps {
  status: "online" | "offline" | "reconnecting"
  lastUpdated: Date | null
  retryCount: number
}

export function ConnectionStatus({ status, lastUpdated, retryCount }: ConnectionStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "text-green-400"
      case "offline":
        return "text-red-400"
      case "reconnecting":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "SYSTEM ONLINE"
      case "offline":
        return "SYSTEM OFFLINE"
      case "reconnecting":
        return `RECONNECTING... (${retryCount}/3)`
      default:
        return "UNKNOWN STATUS"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return <Wifi className="h-3 w-3" />
      case "offline":
        return <WifiOff className="h-3 w-3" />
      case "reconnecting":
        return <RotateCcw className="h-3 w-3 animate-spin" />
      default:
        return <WifiOff className="h-3 w-3" />
    }
  }

  const formatLastUpdated = () => {
    if (!lastUpdated) return "NEVER"

    const now = new Date()
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000)

    if (diff < 60) return `${diff}s AGO`
    if (diff < 3600) return `${Math.floor(diff / 60)}m AGO`
    return lastUpdated.toLocaleTimeString("en-US", { hour12: false })
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-1 ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="text-xs font-mono">{getStatusText()}</span>
      </div>
      <div className="text-xs text-muted-foreground font-mono">LAST SYNC: {formatLastUpdated()}</div>
    </div>
  )
}
