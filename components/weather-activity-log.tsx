"use client"

import { useEffect, useState } from "react"
import { formatTimestamp } from "@/lib/weather-utils"

interface WeatherActivity {
  timestamp: string
  agent: string
  action: string
  location: string
  status: "success" | "warning" | "error"
}

interface WeatherActivityLogProps {
  currentLocation: string
}

export function WeatherActivityLog({ currentLocation }: WeatherActivityLogProps) {
  const [activities, setActivities] = useState<WeatherActivity[]>([])

  useEffect(() => {
    // Simulate weather monitoring activities
    const generateActivities = () => {
      const agents = ["wx_Alpha", "wx_Bravo", "wx_Charlie", "wx_Delta", "wx_Echo"]
      const actions = [
        "completed atmospheric scan",
        "detected pressure change",
        "monitored wind patterns",
        "tracked storm system",
        "analyzed temperature variance",
        "recorded humidity levels",
        "detected weather anomaly",
      ]

      const newActivities: WeatherActivity[] = []
      for (let i = 0; i < 6; i++) {
        const timestamp = new Date(Date.now() - i * 15 * 60 * 1000).toISOString()
        const agent = agents[Math.floor(Math.random() * agents.length)]
        const action = actions[Math.floor(Math.random() * actions.length)]
        const status = Math.random() > 0.8 ? "warning" : "success"

        newActivities.push({
          timestamp,
          agent,
          action,
          location: currentLocation,
          status,
        })
      }
      setActivities(newActivities)
    }

    generateActivities()
  }, [currentLocation])

  return (
    <div className="tactical-panel h-full">
      <h2 className="tactical-header mb-4">WEATHER ACTIVITY LOG</h2>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="border-l-2 border-primary/30 pl-3 py-1">
            <div className="tactical-timestamp mb-1">{formatTimestamp(activity.timestamp)}</div>
            <div className="tactical-data">
              Agent{" "}
              <span className={activity.status === "warning" ? "text-yellow-400" : "text-primary"}>
                {activity.agent}
              </span>{" "}
              {activity.action} in {activity.location}
              {activity.status === "warning" && <span className="ml-2 text-yellow-400">with agent</span>}
            </div>
            {activity.status === "warning" && (
              <div className="text-yellow-400 tactical-data ml-4">
                {agents[Math.floor(Math.random() * agents.length)]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const agents = ["wx_Foxtrot", "wx_Golf", "wx_Hotel", "wx_India"]
