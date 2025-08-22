"use client"

import { useEffect, useState } from "react"
import { Activity, Database, Globe, Server, Wifi, Zap } from "lucide-react"

interface SystemMetrics {
  apiResponseTime: number
  dataFreshness: number
  errorRate: number
  uptime: number
  activeConnections: number
  lastHealthCheck: Date
  services: {
    weatherApi: "operational" | "degraded" | "down"
    disasterMonitoring: "operational" | "degraded" | "down"
    locationServices: "operational" | "degraded" | "down"
    dataSync: "operational" | "degraded" | "down"
  }
}

export function EnhancedSystemStatus() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    apiResponseTime: 0,
    dataFreshness: 0,
    errorRate: 0,
    uptime: 0,
    activeConnections: 0,
    lastHealthCheck: new Date(),
    services: {
      weatherApi: "operational",
      disasterMonitoring: "operational",
      locationServices: "operational",
      dataSync: "operational",
    },
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSystemMetrics = async () => {
      try {
        // Simulate system metrics - in real app, this would call actual health endpoints
        const startTime = Date.now()

        // Simulate API call to measure response time
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 50))

        const responseTime = Date.now() - startTime

        setMetrics({
          apiResponseTime: responseTime,
          dataFreshness: Math.random() * 300, // seconds
          errorRate: Math.random() * 2, // percentage
          uptime: Math.floor(Math.random() * 86400 + 3600), // seconds
          activeConnections: Math.floor(Math.random() * 50 + 10),
          lastHealthCheck: new Date(),
          services: {
            weatherApi: Math.random() > 0.1 ? "operational" : "degraded",
            disasterMonitoring: Math.random() > 0.05 ? "operational" : "degraded",
            locationServices: Math.random() > 0.08 ? "operational" : "degraded",
            dataSync: Math.random() > 0.12 ? "operational" : "degraded",
          },
        })
      } catch (error) {
        console.error("Failed to fetch system metrics:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSystemMetrics()
    const interval = setInterval(fetchSystemMetrics, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getServiceStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-400"
      case "degraded":
        return "text-yellow-400"
      case "down":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return "●"
      case "degraded":
        return "◐"
      case "down":
        return "●"
      default:
        return "○"
    }
  }

  const getPerformanceColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return "text-green-400"
    if (value <= thresholds.warning) return "text-yellow-400"
    return "text-red-400"
  }

  if (isLoading) {
    return (
      <div className="tactical-panel">
        <h2 className="tactical-header mb-4">SYSTEM DIAGNOSTICS</h2>
        <div className="flex items-center justify-center h-32">
          <div className="text-primary">INITIALIZING DIAGNOSTICS...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="tactical-panel">
        <h2 className="tactical-header mb-4">SYSTEM DIAGNOSTICS</h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-neutral-800/50 border border-neutral-700 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-xs tactical-data">RESPONSE TIME</span>
            </div>
            <div
              className={`text-lg font-mono font-bold ${getPerformanceColor(metrics.apiResponseTime, { good: 100, warning: 300 })}`}
            >
              {metrics.apiResponseTime}ms
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Database className="h-4 w-4 text-primary" />
              <span className="text-xs tactical-data">DATA AGE</span>
            </div>
            <div
              className={`text-lg font-mono font-bold ${getPerformanceColor(metrics.dataFreshness, { good: 60, warning: 180 })}`}
            >
              {Math.floor(metrics.dataFreshness)}s
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-xs tactical-data">ERROR RATE</span>
            </div>
            <div
              className={`text-lg font-mono font-bold ${getPerformanceColor(metrics.errorRate, { good: 0.5, warning: 2 })}`}
            >
              {metrics.errorRate.toFixed(2)}%
            </div>
          </div>

          <div className="bg-neutral-800/50 border border-neutral-700 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <Server className="h-4 w-4 text-primary" />
              <span className="text-xs tactical-data">UPTIME</span>
            </div>
            <div className="text-lg font-mono font-bold text-green-400">{formatUptime(metrics.uptime)}</div>
          </div>
        </div>

        {/* Service Status */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono text-primary tracking-wider">SERVICE STATUS</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex justify-between items-center tactical-data">
              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3" />
                <span>WEATHER API</span>
              </div>
              <div className={`flex items-center gap-1 ${getServiceStatusColor(metrics.services.weatherApi)}`}>
                <span>{getServiceStatusIcon(metrics.services.weatherApi)}</span>
                <span className="text-xs">{metrics.services.weatherApi.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center tactical-data">
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                <span>DISASTER MONITORING</span>
              </div>
              <div className={`flex items-center gap-1 ${getServiceStatusColor(metrics.services.disasterMonitoring)}`}>
                <span>{getServiceStatusIcon(metrics.services.disasterMonitoring)}</span>
                <span className="text-xs">{metrics.services.disasterMonitoring.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center tactical-data">
              <div className="flex items-center gap-2">
                <Wifi className="h-3 w-3" />
                <span>LOCATION SERVICES</span>
              </div>
              <div className={`flex items-center gap-1 ${getServiceStatusColor(metrics.services.locationServices)}`}>
                <span>{getServiceStatusIcon(metrics.services.locationServices)}</span>
                <span className="text-xs">{metrics.services.locationServices.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex justify-between items-center tactical-data">
              <div className="flex items-center gap-2">
                <Database className="h-3 w-3" />
                <span>DATA SYNCHRONIZATION</span>
              </div>
              <div className={`flex items-center gap-1 ${getServiceStatusColor(metrics.services.dataSync)}`}>
                <span>{getServiceStatusIcon(metrics.services.dataSync)}</span>
                <span className="text-xs">{metrics.services.dataSync.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-6 pt-4 border-t border-neutral-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 tactical-data text-xs">
            <div className="flex justify-between">
              <span>ACTIVE CONNECTIONS:</span>
              <span className="text-primary">{metrics.activeConnections}</span>
            </div>
            <div className="flex justify-between">
              <span>LAST HEALTH CHECK:</span>
              <span className="text-primary">
                {metrics.lastHealthCheck.toLocaleTimeString("en-US", { hour12: false })}
              </span>
            </div>
            <div className="flex justify-between">
              <span>NEXT SCAN:</span>
              <span className="text-primary">00:00:30</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="tactical-panel">
        <h2 className="tactical-header mb-4">PERFORMANCE METRICS</h2>

        <div className="space-y-4">
          {/* Response Time Chart Placeholder */}
          <div className="bg-neutral-800/30 border border-neutral-700 rounded p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs tactical-data">API RESPONSE TIME (24H)</span>
              <span className="text-xs text-primary">AVG: {metrics.apiResponseTime}ms</span>
            </div>
            <div className="h-16 bg-neutral-900/50 rounded flex items-end justify-between px-2">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="bg-primary/60 w-1 rounded-t" style={{ height: `${Math.random() * 100}%` }} />
              ))}
            </div>
          </div>

          {/* System Load */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-800/30 border border-neutral-700 rounded p-3">
              <div className="text-xs tactical-data mb-2">CPU USAGE</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-neutral-700 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: "35%" }} />
                </div>
                <span className="text-xs text-green-400 font-mono">35%</span>
              </div>
            </div>

            <div className="bg-neutral-800/30 border border-neutral-700 rounded p-3">
              <div className="text-xs tactical-data mb-2">MEMORY USAGE</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-neutral-700 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: "68%" }} />
                </div>
                <span className="text-xs text-yellow-400 font-mono">68%</span>
              </div>
            </div>

            <div className="bg-neutral-800/30 border border-neutral-700 rounded p-3">
              <div className="text-xs tactical-data mb-2">NETWORK I/O</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-neutral-700 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: "42%" }} />
                </div>
                <span className="text-xs text-blue-400 font-mono">42%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
