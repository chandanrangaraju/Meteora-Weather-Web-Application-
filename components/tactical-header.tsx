"use client"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertTriangle } from "lucide-react"
import { LocationSearch } from "@/components/location-search"

interface TacticalHeaderProps {
  currentLocation: string
  onLocationChange: (location: string, coordinates?: { lat: number; lon: number }) => void
  onRefresh: () => void
  isLoading: boolean
}

export function TacticalHeader({ currentLocation, onLocationChange, onRefresh, isLoading }: TacticalHeaderProps) {
  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="tactical-header">METEORA WEATHER OVERVIEW</h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="tactical-timestamp">
                LAST UPDATE:{" "}
                {new Date()
                  .toLocaleString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                  .replace(",", "")}{" "}
                UTC
              </span>
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-yellow-400" />
                <span className="text-xs text-yellow-400">WEATHER MONITORING ACTIVE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LocationSearch currentLocation={currentLocation} onLocationChange={onLocationChange} isLoading={isLoading} />
          <Button
            onClick={onRefresh}
            size="sm"
            variant="outline"
            disabled={isLoading}
            className="border-border bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  )
}
