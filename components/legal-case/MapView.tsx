"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { google } from "google-maps";
import { demoMode, getMapDataset } from "@/lib/demoConfig";

declare global {
  interface Window {
    initGoogleMap?: () => void;
    gm_authFailure?: () => void;
  }
}

export function MapView() {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Dynamic dataset based on demo mode
  const dataset = getMapDataset(demoMode);
  const { items, stats, filters, title, subtitle } = dataset;

  useEffect(() => {
    const initMap = () => {
      if (typeof window !== "undefined" && window.google) {
        const mapElement = document.getElementById("map");
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
            });

            items.forEach((item) => {
              const position = { lat: item.lat, lng: item.lng };
              new window.google.maps.Marker({
                position,
                map: googleMap,
                title: item.title,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: Math.max(6, Math.min(18, dataset.circleRadius(item) / 50)),
                  fillColor: dataset.markerColor(item),
                  fillOpacity: 0.85,
                  strokeColor: "#ffffff",
                  strokeWeight: 2,
                },
              });

              const radius = dataset.circleRadius(item);
              if (radius > 0) {
                new window.google.maps.Circle({
                  strokeColor: dataset.markerColor(item),
                  strokeOpacity: 0.55,
                  strokeWeight: 1,
                  fillColor: dataset.markerColor(item),
                  fillOpacity: 0.15,
                  map: googleMap,
                  center: position,
                  radius,
                });
              }
            });

            setMap(googleMap);
            setMapError(null);
          } catch (error) {
            console.error("Error initializing Google Maps:", error);
            setMapError(
              "Failed to initialize map. Please check your API key configuration."
            );
          }
        }
      }
    };

    const handleMapError = (error: any) => {
      console.error("Google Maps API Error:", error);
      if (
        error.message &&
        error.message.includes("RefererNotAllowedMapError")
      ) {
        setMapError(
          "API key not configured for this domain. Please add the current domain to your Google Cloud Console API key restrictions."
        );
      } else {
        setMapError(
          "Failed to load Google Maps. Please check your API key and internet connection."
        );
      }
    };

    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );
    if (existingScript) {
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          initMap();
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initGoogleMap`;
    script.async = true;
    script.defer = true;

    window.initGoogleMap = initMap;

    script.onerror = (error) => {
      handleMapError(error);
    };

    window.gm_authFailure = () => {
      setMapError(
        "Google Maps API authentication failed. Please check your API key configuration in Google Cloud Console."
      );
    };

    document.head.appendChild(script);

    return () => {
      if (window.initGoogleMap) {
        delete window.initGoogleMap;
      }
      if (window.gm_authFailure) {
        delete window.gm_authFailure;
      }
    };
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Major":
        return "bg-red-100 text-red-800 border-red-200";
      case "Significant":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredItems = items.filter((i) => {
    if (selectedFilter === "all") return true;
    return i.category === selectedFilter;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-5">
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">
              {subtitle} · Mode: <span className="font-medium">{demoMode}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index} className="py-4">
              <CardContent className="px-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
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
              className="cursor-pointer">
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="shadow-sm py-4">
              <CardContent className="px-4">
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-base leading-tight">
                      {item.title}
                    </h3>
                    {item.label && (
                      <Badge className="bg-gray-100 text-gray-700 border text-xs font-medium px-2 py-1 ml-2 flex-shrink-0">
                        {item.label}
                      </Badge>
                    )}
                  </div>
                  {item.meta?.updated && (
                    <p className="text-sm text-gray-600 mb-3">
                      Updated {item.meta.updated}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    {item.label && (
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                        {item.label}
                      </button>
                    )}
                    <span className="text-sm font-medium text-gray-900 truncate ml-auto">
                      {item.primaryMetric.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
