"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Cloud, Zap, Settings } from "lucide-react"
import { ConnectionStatus } from "@/components/connection-status"

interface TacticalSidebarProps {
  currentLocation: string
  onLocationChange: (location: string) => void
  connectionStatus: "online" | "offline" | "reconnecting"
  lastUpdated: Date | null
  retryCount: number
  activeSection: "weather" | "alerts" | "systems"
  onSectionChange: (section: "weather" | "alerts" | "systems") => void
}

export function TacticalSidebar({
  currentLocation,
  onLocationChange,
  connectionStatus,
  lastUpdated,
  retryCount,
  activeSection,
  onSectionChange,
}: TacticalSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { icon: Cloud, label: "WEATHER OPS", key: "weather" as const },
    { icon: Zap, label: "ALERTS", key: "alerts" as const },
    { icon: Settings, label: "SYSTEMS", key: "systems" as const },
  ]

  return (
    <div
      className={`bg-neutral-900 text-gray-300 transition-all duration-300 ${isCollapsed ? "w-16" : "w-48"} h-screen flex flex-col border-r border-neutral-800`}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-sm font-bold tracking-wider text-orange-500">METEORA</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-gray-300 hover:bg-neutral-800"
          >
            <ChevronLeft className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {menuItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            onClick={() => onSectionChange(item.key)}
            className={`w-full justify-start mb-1 text-xs font-mono ${
              activeSection === item.key
                ? "bg-orange-600 text-white hover:bg-orange-700"
                : "text-gray-400 hover:bg-neutral-800 hover:text-gray-300"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2 tracking-wider">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* System Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-neutral-800">
          <ConnectionStatus status={connectionStatus} lastUpdated={lastUpdated} retryCount={retryCount} />
        </div>
      )}
    </div>
  )
}
