import { type NextRequest, NextResponse } from "next/server"

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "Unknown"

  try {
    const alerts: DisasterAlert[] = generateMockAlerts(location)

    return NextResponse.json({
      alerts,
      location,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Disaster alerts API error:", error)
    return NextResponse.json({ error: "Failed to fetch disaster alerts", alerts: [] }, { status: 500 })
  }
}

function generateMockAlerts(location: string): DisasterAlert[] {
  const alerts: DisasterAlert[] = []
  const now = new Date()

  // Generate realistic alerts based on location patterns
  const locationLower = location.toLowerCase()

  // Earthquake-prone areas
  if (
    locationLower.includes("japan") ||
    locationLower.includes("california") ||
    locationLower.includes("turkey") ||
    locationLower.includes("nepal")
  ) {
    if (Math.random() > 0.7) {
      alerts.push({
        id: `eq-${Date.now()}`,
        type: "earthquake",
        severity: Math.random() > 0.8 ? "high" : "medium",
        title: "Seismic Activity Detected",
        description: `Magnitude 4.2 earthquake detected 45km from ${location}. Aftershocks possible.`,
        location: location,
        timestamp: new Date(now.getTime() - Math.random() * 3600000).toISOString(),
        isActive: true,
      })
    }
  }

  // Coastal areas - tsunami risk
  if (
    locationLower.includes("coast") ||
    locationLower.includes("beach") ||
    locationLower.includes("mumbai") ||
    locationLower.includes("chennai") ||
    locationLower.includes("tokyo") ||
    locationLower.includes("miami")
  ) {
    if (Math.random() > 0.85) {
      alerts.push({
        id: `ts-${Date.now()}`,
        type: "tsunami",
        severity: "critical",
        title: "Tsunami Watch Issued",
        description: `Tsunami warning for coastal areas near ${location}. Evacuate to higher ground immediately.`,
        location: location,
        timestamp: new Date(now.getTime() - Math.random() * 1800000).toISOString(),
        isActive: true,
      })
    }
  }

  // Monsoon/flood-prone areas
  if (
    locationLower.includes("bengaluru") ||
    locationLower.includes("mumbai") ||
    locationLower.includes("kerala") ||
    locationLower.includes("bangladesh")
  ) {
    if (Math.random() > 0.6) {
      alerts.push({
        id: `fl-${Date.now()}`,
        type: "flood",
        severity: Math.random() > 0.7 ? "high" : "medium",
        title: "Flash Flood Warning",
        description: `Heavy rainfall expected. Risk of urban flooding in low-lying areas of ${location}.`,
        location: location,
        timestamp: new Date(now.getTime() - Math.random() * 7200000).toISOString(),
        isActive: true,
      })
    }
  }

  // Cyclone-prone areas
  if (
    locationLower.includes("bengal") ||
    locationLower.includes("odisha") ||
    locationLower.includes("florida") ||
    locationLower.includes("philippines")
  ) {
    if (Math.random() > 0.8) {
      alerts.push({
        id: `cy-${Date.now()}`,
        type: "cyclone",
        severity: "high",
        title: "Cyclonic Storm Approaching",
        description: `Severe cyclonic storm moving towards ${location}. Wind speeds up to 120 km/h expected.`,
        location: location,
        timestamp: new Date(now.getTime() - Math.random() * 10800000).toISOString(),
        isActive: true,
      })
    }
  }

  // Landslide-prone areas
  if (
    locationLower.includes("hill") ||
    locationLower.includes("mountain") ||
    locationLower.includes("himachal") ||
    locationLower.includes("uttarakhand")
  ) {
    if (Math.random() > 0.75) {
      alerts.push({
        id: `ls-${Date.now()}`,
        type: "landslide",
        severity: "medium",
        title: "Landslide Risk Elevated",
        description: `Heavy rainfall has increased landslide risk in hilly areas near ${location}.`,
        location: location,
        timestamp: new Date(now.getTime() - Math.random() * 5400000).toISOString(),
        isActive: true,
      })
    }
  }

  // Add some random low-severity alerts for demonstration
  if (Math.random() > 0.5) {
    const randomAlerts = [
      {
        type: "wildfire" as const,
        title: "Fire Weather Watch",
        description: "Dry conditions and strong winds increase fire risk.",
      },
      {
        type: "tornado" as const,
        title: "Severe Thunderstorm Warning",
        description: "Conditions favorable for tornado development.",
      },
    ]

    const randomAlert = randomAlerts[Math.floor(Math.random() * randomAlerts.length)]
    alerts.push({
      id: `rnd-${Date.now()}`,
      type: randomAlert.type,
      severity: "low",
      title: randomAlert.title,
      description: `${randomAlert.description} Monitoring ${location} area.`,
      location: location,
      timestamp: new Date(now.getTime() - Math.random() * 14400000).toISOString(),
      isActive: true,
    })
  }

  return alerts.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    return severityOrder[b.severity] - severityOrder[a.severity]
  })
}
