"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Loader2, Navigation, Clock, X } from "lucide-react"
import { useGeolocation } from "@/hooks/use-geolocation"

interface LocationSuggestion {
  name: string
  region: string
  country: string
  displayName: string
  coordinates: { lat: number; lon: number }
}

interface LocationSearchProps {
  onLocationSelect: (location: string) => void
  loading?: boolean
}

export function LocationSearch({ onLocationSelect, loading = false }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { coordinates, loading: geoLoading, error: geoError, getCurrentLocation } = useGeolocation()

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem("weather-recent-searches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse recent searches:", e)
      }
    }
  }, [])

  useEffect(() => {
    // Handle geolocation result
    if (coordinates) {
      const locationString = `${coordinates.lat},${coordinates.lon}`
      onLocationSelect(locationString)
    }
  }, [coordinates, onLocationSelect])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        return
      }

      setLoadingSuggestions(true)
      try {
        const response = await fetch(`/api/locations?q=${encodeURIComponent(searchQuery)}`)
        const result = await response.json()
        if (result.success) {
          setSuggestions(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error)
      } finally {
        setLoadingSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      selectLocation(searchQuery.trim())
    }
  }

  const selectLocation = (location: string) => {
    onLocationSelect(location)
    setSearchQuery("")
    setShowSuggestions(false)

    // Add to recent searches
    const updated = [location, ...recentSearches.filter((s) => s !== location)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("weather-recent-searches", JSON.stringify(updated))
  }

  const removeRecentSearch = (location: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = recentSearches.filter((s) => s !== location)
    setRecentSearches(updated)
    localStorage.setItem("weather-recent-searches", JSON.stringify(updated))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div ref={searchRef} className="relative">
      <Card className="glass border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for a city or location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSuggestions(true)}
                className="pl-10 h-12 text-lg border-0 bg-background/50 backdrop-blur-sm"
                disabled={loading}
              />
            </div>
            <Button
              size="lg"
              className="h-12 px-8 font-semibold"
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-4 bg-transparent"
              onClick={getCurrentLocation}
              disabled={geoLoading}
              title="Use current location"
            >
              {geoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            </Button>
          </div>

          {geoError && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive font-serif">{geoError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions Dropdown */}
      {showSuggestions && (searchQuery.length >= 2 || recentSearches.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 glass border-0 shadow-2xl z-50">
          <CardContent className="p-4">
            {loadingSuggestions ? (
              <div className="flex items-center gap-2 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-serif">Searching locations...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 font-serif">Suggestions</h4>
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => selectLocation(suggestion.displayName)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors text-left"
                      >
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <div className="flex-1">
                          <div className="font-medium font-sans">{suggestion.name}</div>
                          <div className="text-sm text-muted-foreground font-serif">
                            {suggestion.region}, {suggestion.country}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {recentSearches.length > 0 && searchQuery.length < 2 && (
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2 font-serif">Recent Searches</h4>
                    {recentSearches.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => selectLocation(location)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors text-left group"
                      >
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 font-serif">{location}</div>
                        <button
                          onClick={(e) => removeRecentSearch(location, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted/50 rounded transition-all"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.length === 0 && searchQuery.length >= 2 && !loadingSuggestions && (
                  <div className="py-4 text-center text-muted-foreground font-serif">
                    No locations found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
