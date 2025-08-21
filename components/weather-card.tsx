import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { LucideIcon } from "lucide-react"

interface WeatherCardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  description?: string
  trend?: "up" | "down" | "stable"
  className?: string
}

export function WeatherCard({ title, value, unit, icon: Icon, description, trend, className = "" }: WeatherCardProps) {
  return (
    <Card className={`glass border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="font-serif text-sm text-muted-foreground">{title}</CardTitle>
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-sans text-foreground">{value}</span>
            {unit && <span className="text-sm text-muted-foreground font-serif">{unit}</span>}
          </div>
          {description && <p className="text-xs text-muted-foreground font-serif">{description}</p>}
          {trend && (
            <Badge
              variant={trend === "up" ? "default" : trend === "down" ? "destructive" : "secondary"}
              className="text-xs"
            >
              {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"} {trend}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
