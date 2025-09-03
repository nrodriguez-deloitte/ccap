"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import type { google } from "google-maps"

export function MapView() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [mapError, setMapError] = useState<string | null>(null)

  const outages = [
    {
      id: "sydney-outage-3",
      title: "Sydney Outage 3",
      severity: "Significant",
      updated: "8/19/2025, 9:59:00 PM",
      stage: "Stage 1",
      servicesImpacted: 10000,
      location: { lat: -33.8688, lng: 151.2093 },
      category: "significant",
    },
    {
      id: "network-connectivity",
      title: "Network connectivity issue in Sydney CBD area",
      severity: "Major",
      updated: "8/19/2025, 9:58:43 PM",
      stage: "Stage 1",
      servicesImpacted: 5000,
      location: { lat: -33.865, lng: 151.2094 },
      category: "major",
    },
    {
      id: "sydney-outage",
      title: "Sydney Outage",
      severity: "Significant",
      updated: "8/18/2025, 1:07:24 PM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -33.87, lng: 151.21 },
      category: "significant",
    },
    {
      id: "inc10-major",
      title: "INC10 - Major Outage",
      severity: "Major",
      updated: "8/14/2025, 2:47:07 PM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -37.8136, lng: 144.9631 },
      category: "major",
    },
    {
      id: "inc1-major",
      title: "INC1 - Major Outage",
      severity: "Major",
      updated: "8/14/2025, 2:42:28 PM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -31.9505, lng: 115.8605 },
      category: "major",
    },
    {
      id: "inc12445-major",
      title: "INC12445 - Major Outage",
      severity: "Major",
      updated: "8/11/2025, 11:30:21 AM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -34.9285, lng: 138.6007 },
      category: "major",
    },
    {
      id: "inc1244-major",
      title: "INC1244 - Major Outage",
      severity: "Major",
      updated: "8/11/2025, 11:27:31 AM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -27.4698, lng: 153.0251 },
      category: "major",
    },
    {
      id: "inc1234-major",
      title: "INC1234 - Major Outage",
      severity: "Major",
      updated: "8/11/2025, 11:18:38 AM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -42.8821, lng: 147.3272 },
      category: "major",
    },
    {
      id: "inc123456-major",
      title: "INC123456 - Major Outage",
      severity: "Major",
      updated: "8/11/2025, 11:10:29 AM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -35.2809, lng: 149.13 },
      category: "major",
    },
    {
      id: "inc12345-major",
      title: "INC12345 - Major Outage",
      severity: "Major",
      updated: "8/11/2025, 11:05:15 AM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -12.4634, lng: 130.8456 },
      category: "major",
    },
    {
      id: "inc123-major-1",
      title: "INC123 - Major Outage",
      severity: "Major",
      updated: "8/8/2025, 1:42:52 PM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -23.698, lng: 133.8807 },
      category: "major",
    },
    {
      id: "inc123-major-2",
      title: "INC123 - Major Outage",
      severity: "Major",
      updated: "8/8/2025, 11:33:10 AM",
      stage: "Stage 1",
      servicesImpacted: 0,
      location: { lat: -16.9186, lng: 145.7781 },
      category: "major",
    },
  ]

  const stats = [
    { label: "Total outage incidents", value: "12" },
    { label: "Services impacted", value: "15,000" },
    { label: "Current unplanned outages", value: "3,120" },
    { label: "Compliance risk", value: "52" },
  ]

  const filters = [
    { id: "all", label: "All unplanned ACMA outages", count: 12 },
    { id: "major", label: "Major", count: 10 },
    { id: "significant", label: "Significant", count: 2 },
    { id: "compliance", label: "Compliance risk", count: 0 },
  ]

  useEffect(() => {
    const initMap = () => {
      if (typeof window !== "undefined" && window.google) {
        const mapElement = document.getElementById("map")
        if (mapElement) {
          try {
            const googleMap = new window.google.maps.Map(mapElement, {
              center: { lat: -25.2744, lng: 133.7751 }, // Australia center
              zoom: 5,
              styles: [
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#a2daf2" }],
                },
              ],
            })

            outages.forEach((outage) => {
              const marker = new window.google.maps.Marker({
                position: outage.location,
                map: googleMap,
                title: outage.title,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: outage.servicesImpacted > 5000 ? 12 : 8,
                  fillColor:
                    outage.severity === "Major" ? "#ef4444" : outage.severity === "Significant" ? "#f59e0b" : "#10b981",
                  fillOpacity: 0.8,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                },
              })

              if (outage.servicesImpacted > 0) {
                new window.google.maps.Circle({
                  strokeColor: outage.severity === "Major" ? "#ef4444" : "#f59e0b",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: outage.severity === "Major" ? "#ef4444" : "#f59e0b",
                  fillOpacity: 0.2,
                  map: googleMap,
                  center: outage.location,
                  radius: outage.servicesImpacted * 10,
                })
              }
            })

            setMap(googleMap)
            setMapError(null)
          } catch (error) {
            console.error("Error initializing Google Maps:", error)
            setMapError("Failed to initialize map. Please check your API key configuration.")
          }
        }
      }
    }

    const handleMapError = (error: any) => {
      console.error("Google Maps API Error:", error)
      if (error.message && error.message.includes("RefererNotAllowedMapError")) {
        setMapError(
          "API key not configured for this domain. Please add the current domain to your Google Cloud Console API key restrictions.",
        )
      } else {
        setMapError("Failed to load Google Maps. Please check your API key and internet connection.")
      }
    }

    if (window.google && window.google.maps) {
      initMap()
      return
    }

    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          initMap()
        } else {
          setTimeout(checkGoogleMaps, 100)
        }
      }
      checkGoogleMaps()
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initGoogleMap`
    script.async = true
    script.defer = true

    window.initGoogleMap = initMap

    script.onerror = (error) => {
      handleMapError(error)
    }

    window.gm_authFailure = () => {
      setMapError(
        "Google Maps API authentication failed. Please check your API key configuration in Google Cloud Console.",
      )
    }

    document.head.appendChild(script)

    return () => {
      if (window.initGoogleMap) {
        delete window.initGoogleMap
      }
      if (window.gm_authFailure) {
        delete window.gm_authFailure
      }
    }
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Major":
        return "bg-red-100 text-red-800 border-red-200"
      case "Significant":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filteredOutages = outages.filter((outage) => {
    if (selectedFilter === "all") return true
    if (selectedFilter === "major") return outage.category === "major"
    if (selectedFilter === "significant") return outage.category === "significant"
    if (selectedFilter === "compliance") return outage.category === "compliance"
    return true
  })

  return (
    <div className="bg-gray-50 min-h-screen pb-5">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Current unplanned outages</h1>
          <span className="text-sm text-gray-600">Last updated at 1:35pm</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="px-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <CardContent className="p-0">
            {mapError ? (
              <div className="w-full h-96 rounded-lg bg-gray-100 flex items-center justify-center">
                <div className="text-center p-6">
                  <div className="text-red-600 mb-2">⚠️ Map Loading Error</div>
                  <p className="text-sm text-gray-600 mb-4">{mapError}</p>
                  <div className="text-xs text-gray-500">
                    <p>To fix this issue:</p>
                    <p>1. Go to Google Cloud Console</p>
                    <p>2. Navigate to APIs & Services → Credentials</p>
                    <p>3. Edit your API key</p>
                    <p>4. Add this domain to Application restrictions</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div id="map" className="w-full h-96 rounded-lg"></div>
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      Compliance risk
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      Resolved
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      Planned
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex items-center mb-1">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 mr-2"></div>
                        &lt; 10,000
                      </div>
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400 mr-2"></div>
                        10,000-50,000
                      </div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full border-2 border-gray-400 mr-2"></div>
                        50,000+
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex space-x-1 mb-6">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              onClick={() => setSelectedFilter(filter.id)}
              className="cursor-pointer"
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredOutages.map((outage) => (
            <Card key={outage.id} className="shadow-sm">
              <CardContent className="px-4">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">{outage.title}</h3>
                    <Badge
                      className={`${getSeverityColor(outage.severity)} text-xs font-medium px-2 py-1 ml-2 flex-shrink-0`}
                    >
                      {outage.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Updated {outage.updated}</p>
                  <div className="flex items-center justify-between">
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                      {outage.stage}
                    </button>
                    <span className="text-sm font-medium text-gray-900">
                      {outage.servicesImpacted > 0
                        ? `${outage.servicesImpacted.toLocaleString()} services impacted`
                        : "—"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
