"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Clock, X, Crosshair, Globe } from "lucide-react"

interface LocationSuggestion {
  name: string
  country: string
  state?: string
  lat: number
  lon: number
  display: string
  type: string
}

interface LocationSearchProps {
  currentLocation: string
  onLocationChange: (location: string, coordinates?: { lat: number; lon: number }) => void
  isLoading: boolean
}

export function LocationSearch({ currentLocation, onLocationChange, isLoading }: LocationSearchProps) {
  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentLocations, setRecentLocations] = useState<string[]>([])
  const [isGeolocating, setIsGeolocating] = useState(false)
  const [searchType, setSearchType] = useState<"name" | "coordinates" | "postal">("name")
  const searchRef = useRef<HTMLDivElement>(null)

  // Load recent locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tactical-weather-recent-locations")
    if (saved) {
      setRecentLocations(JSON.parse(saved))
    }
  }, [])

  // Save recent locations to localStorage
  const saveRecentLocation = (location: string) => {
    const updated = [location, ...recentLocations.filter((l) => l !== location)].slice(0, 5)
    setRecentLocations(updated)
    localStorage.setItem("tactical-weather-recent-locations", JSON.stringify(updated))
  }

  // Fetch location suggestions
  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "demo_key"
      let suggestions: LocationSuggestion[] = []

      // Detect search type
      const coordinatePattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/
      const postalPattern = /^\d{5}(-\d{4})?$|^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i

      if (coordinatePattern.test(query.trim())) {
        // Coordinate search
        const [lat, lon] = query.split(",").map((s) => Number.parseFloat(s.trim()))
        if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`,
          )
          if (response.ok) {
            const data = await response.json()
            suggestions = data.map((item: any) => ({
              name: item.name,
              country: item.country,
              state: item.state,
              lat: item.lat,
              lon: item.lon,
              display: `${item.name}, ${item.state ? item.state + ", " : ""}${item.country}`,
              type: "coordinate",
            }))
          }
        }
      } else if (postalPattern.test(query.trim())) {
        // Postal code search
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/zip?zip=${encodeURIComponent(query.trim())}&appid=${apiKey}`,
        )
        if (response.ok) {
          const data = await response.json()
          suggestions = [
            {
              name: data.name,
              country: data.country,
              lat: data.lat,
              lon: data.lon,
              display: `${data.name}, ${data.country} (${query.trim()})`,
              type: "postal",
            },
          ]
        }
      } else {
        // Enhanced city/location name search with increased limit
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=15&appid=${apiKey}`,
        )
        if (response.ok) {
          const data = await response.json()
          suggestions = data.map((item: any) => ({
            name: item.name,
            country: item.country,
            state: item.state,
            lat: item.lat,
            lon: item.lon,
            display: `${item.name}, ${item.state ? item.state + ", " : ""}${item.country}`,
            type: "city",
          }))
        }
      }

      // Remove duplicates and sort by relevance
      const uniqueSuggestions = suggestions.filter(
        (suggestion, index, self) =>
          index === self.findIndex((s) => s.lat === suggestion.lat && s.lon === suggestion.lon),
      )

      setSuggestions(uniqueSuggestions)
    } catch (error) {
      console.error("Failed to fetch location suggestions:", error)
      setSuggestions([])
    }
  }

  // Handle input change with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput) {
        fetchSuggestions(searchInput)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (location: string, coordinates?: { lat: number; lon: number }) => {
    onLocationChange(location, coordinates)
    saveRecentLocation(location)
    setSearchInput("")
    setShowSuggestions(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (suggestions.length > 0) {
        const first = suggestions[0]
        handleSearch(first.display, { lat: first.lat, lon: first.lon })
      } else if (searchInput.trim()) {
        handleSearch(searchInput.trim())
      }
    }
  }

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.")
      return
    }

    setIsGeolocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          // Reverse geocoding to get location name
          const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || "demo_key"
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`,
          )

          if (response.ok) {
            const data = await response.json()
            if (data.length > 0) {
              const location = `${data[0].name}, ${data[0].country}`
              handleSearch(location, { lat: latitude, lon: longitude })
            }
          }
        } catch (error) {
          console.error("Failed to get location name:", error)
          handleSearch("Current Location", { lat: latitude, lon: longitude })
        } finally {
          setIsGeolocating(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        setIsGeolocating(false)
        alert("Failed to get your location. Please check your browser permissions.")
      },
    )
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            placeholder="City, coordinates (lat,lon), or postal code..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(searchInput.length >= 2 || recentLocations.length > 0)}
            className="w-80 bg-input border-border text-xs font-mono pr-8"
          />
          {searchInput && (
            <Button
              onClick={() => {
                setSearchInput("")
                setShowSuggestions(false)
              }}
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <Button
          onClick={() => {
            if (suggestions.length > 0) {
              const first = suggestions[0]
              handleSearch(first.display, { lat: first.lat, lon: first.lon })
            } else if (searchInput.trim()) {
              handleSearch(searchInput.trim())
            }
          }}
          size="sm"
          disabled={isLoading}
          className="bg-primary hover:bg-primary/80"
        >
          <Search className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleGeolocation}
          size="sm"
          variant="outline"
          disabled={isGeolocating}
          className="border-border bg-transparent"
          title="Use current location"
        >
          <Crosshair className={`h-4 w-4 ${isGeolocating ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Enhanced suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-sm shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Search format help */}
          {!searchInput && (
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-3 w-3 text-muted-foreground" />
                <span className="tactical-header text-xs">GLOBAL SEARCH FORMATS</span>
              </div>
              <div className="text-xs font-mono text-muted-foreground space-y-1">
                <div>• City: "Tokyo", "New York", "Mumbai"</div>
                <div>• Coordinates: "40.7128,-74.0060"</div>
                <div>• Postal: "10001", "SW1A 1AA"</div>
              </div>
            </div>
          )}

          {/* Recent locations */}
          {recentLocations.length > 0 && !searchInput && (
            <div className="p-2 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="tactical-header text-xs">RECENT TARGETS</span>
              </div>
              {recentLocations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(location)}
                  className="w-full text-left px-2 py-1 text-xs font-mono hover:bg-accent rounded-sm"
                >
                  {location}
                </button>
              ))}
            </div>
          )}

          {/* Enhanced location suggestions with type indicators */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="tactical-header text-xs">GLOBAL TARGETS ({suggestions.length})</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(suggestion.display, { lat: suggestion.lat, lon: suggestion.lon })}
                  className="w-full text-left px-2 py-1 text-xs font-mono hover:bg-accent rounded-sm flex justify-between items-center group"
                >
                  <div className="flex flex-col">
                    <span>{suggestion.display}</span>
                    <span className="text-muted-foreground text-xs">
                      {suggestion.type.toUpperCase()} • {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MapPin className="h-3 w-3 text-primary" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {searchInput.length >= 2 && suggestions.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-xs">
              <Globe className="h-4 w-4 mx-auto mb-2 opacity-50" />
              NO GLOBAL TARGETS FOUND
              <div className="mt-1 text-xs">Try: city name, lat,lon, or postal code</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
