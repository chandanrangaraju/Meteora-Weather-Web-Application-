"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: Record<string, any>
  }
>(({ className, config, ...props }, ref) => {
  return <div ref={ref} className={cn("w-full", className)} {...props} />
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = ({ content, ...props }: any) => {
  return <div {...props}>{content}</div>
}

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    active?: boolean
    payload?: any[]
    label?: string
  }
>(({ className, active, payload, label, ...props }, ref) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div ref={ref} className={cn("glass rounded-lg border-0 shadow-lg p-3 text-sm", className)} {...props}>
      {label && <div className="font-serif text-xs text-muted-foreground mb-1">{label}</div>}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="font-serif text-xs">
              {entry.name}: <span className="font-sans font-semibold">{entry.value}</span>
              {entry.name?.toLowerCase().includes("temp") && "°C"}
              {entry.name?.toLowerCase().includes("rain") && "%"}
              {entry.name?.toLowerCase().includes("humidity") && "%"}
              {entry.name?.toLowerCase().includes("wind") && " km/h"}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltip, ChartTooltipContent }
