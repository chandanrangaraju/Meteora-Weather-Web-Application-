"use client"

import { useEffect, useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Zap, Waves, Mountain, CloudRain, Wind } from "lucide-react"

interface DisasterAlert {
  id: string
  type: "earthquake" | "tsunami" | "landslide" | "flood" | "cyclone" | "wildfire" | "tornado"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  location: string
  timestamp: string
  isActive: boolean
}

interface DisasterAlertsProps {
  currentLocation: string
}

export function DisasterAlerts({ currentLocation }: DisasterAlertsProps) {
  const [alerts, setAlerts] = useState<DisasterAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`/api/disaster-alerts?location=${encodeURIComponent(currentLocation)}`)
        if (response.ok) {
          const data = await response.json()
          setAlerts(data.alerts || [])
        }
      } catch (error) {
        console.error("Failed to fetch disaster alerts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    // Refresh alerts every 2 minutes
    const interval = setInterval(fetchAlerts, 120000)
    return () => clearInterval(interval)
  }, [currentLocation])

  const getAlertIcon = (type: DisasterAlert["type"]) => {
    switch (type) {
      case "earthquake":
        return <Zap className="h-4 w-4" />
      case "tsunami":
        return <Waves className="h-4 w-4" />
      case "landslide":
        return <Mountain className="h-4 w-4" />
      case "flood":
        return <CloudRain className="h-4 w-4" />
      case "cyclone":
        return <Wind className="h-4 w-4" />
      case "tornado":
        return <Wind className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: DisasterAlert["severity"]) => {
    switch (severity) {
      case "critical":
        return "text-red-400 border-red-400/30 bg-red-400/5"
      case "high":
        return "text-orange-400 border-orange-400/30 bg-orange-400/5"
      case "medium":
        return "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
      case "low":
        return "text-blue-400 border-blue-400/30 bg-blue-400/5"
      default:
        return "text-gray-400 border-gray-400/30 bg-gray-400/5"
    }
  }

  const getSeverityLabel = (severity: DisasterAlert["severity"]) => {
    return severity.toUpperCase()
  }

  if (loading) {
    return (
      <div className="tactical-panel h-full">
        <h2 className="tactical-header mb-4">DISASTER ALERTS</h2>
        <div className="flex items-center justify-center h-32">
          <div className="text-muted-foreground tactical-data">SCANNING FOR THREATS...</div>
        </div>
      </div>
    )
  }

  const activeAlerts = alerts.filter((alert) => alert.isActive)
  const criticalAlerts = activeAlerts.filter((alert) => alert.severity === "critical")
  const highAlerts = activeAlerts.filter((alert) => alert.severity === "high")

  return (
    <div className="tactical-panel h-full">
      <h2 className="tactical-header mb-4">DISASTER ALERTS</h2>

      {/* Alert Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-red-400/10 border border-red-400/30 rounded p-2 text-center">
          <div className="text-red-400 text-lg font-bold font-mono">{criticalAlerts.length}</div>
          <div className="text-xs text-red-400">CRITICAL</div>
        </div>
        <div className="bg-orange-400/10 border border-orange-400/30 rounded p-2 text-center">
          <div className="text-orange-400 text-lg font-bold font-mono">{highAlerts.length}</div>
          <div className="text-xs text-orange-400">HIGH</div>
        </div>
        <div className="bg-green-400/10 border border-green-400/30 rounded p-2 text-center">
          <div className="text-green-400 text-lg font-bold font-mono">{activeAlerts.length}</div>
          <div className="text-xs text-green-400">TOTAL</div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activeAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-green-400 mb-2">● ALL CLEAR</div>
            <div className="tactical-data text-muted-foreground">NO ACTIVE DISASTER THREATS DETECTED</div>
            <div className="tactical-timestamp mt-2">
              LAST SCAN: {new Date().toLocaleTimeString("en-US", { hour12: false })} UTC
            </div>
          </div>
        ) : (
          activeAlerts.map((alert) => (
            <Alert key={alert.id} className={`${getSeverityColor(alert.severity)} border`}>
              {getAlertIcon(alert.type)}
              <AlertTitle className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-wider">
                  {alert.type.toUpperCase()} - {getSeverityLabel(alert.severity)}
                </span>
                <span className="tactical-timestamp">
                  {new Date(alert.timestamp).toLocaleTimeString("en-US", { hour12: false })}
                </span>
              </AlertTitle>
              <AlertDescription>
                <div className="space-y-1">
                  <div className="font-medium">{alert.title}</div>
                  <div className="text-xs">{alert.description}</div>
                  <div className="text-xs opacity-75">LOCATION: {alert.location}</div>
                </div>
              </AlertDescription>
            </Alert>
          ))
        )}
      </div>

      {/* System Status */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex justify-between tactical-data text-xs">
          <span>MONITORING STATUS:</span>
          <span className="text-green-400">ACTIVE</span>
        </div>
        <div className="flex justify-between tactical-data text-xs">
          <span>NEXT SCAN:</span>
          <span className="text-primary">00:01:45</span>
        </div>
      </div>
    </div>
  )
}
