"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Search } from "lucide-react"

export function OutagesView() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    console.log("Searching for:", searchQuery)
    // In a real app, this would trigger the AI search functionality
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Central Logo/Graphic */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 opacity-90 flex items-center justify-center shadow-2xl">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-white/30 to-transparent backdrop-blur-sm flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                  <div className="w-8 h-1 bg-white rounded-full transform rotate-45 relative">
                    <div className="w-8 h-1 bg-white rounded-full transform -rotate-90 absolute"></div>
                  </div>
                </div>
              </div>
            </div>
            {/* Orbital rings */}
            <div
              className="absolute inset-0 rounded-full border-2 border-blue-300/30 animate-spin"
              style={{ animationDuration: "10s" }}
            ></div>
            <div
              className="absolute inset-2 rounded-full border border-green-400/40 animate-spin"
              style={{ animationDuration: "8s", animationDirection: "reverse" }}
            ></div>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Explore network outages</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Use AI to find details on both open and resolved outages, along with associated communication notifications.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-lg mx-auto">
          <Input
            type="text"
            placeholder="Ask anything about network outages"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-4 pr-12 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-200"
          />
          <Button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
            size="sm"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Quick Action Suggestions */}
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Button
            variant="outline"
            className="rounded-full bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90 transition-all duration-200"
            onClick={() => setSearchQuery("Show me current outages")}
          >
            Current outages
          </Button>
          <Button
            variant="outline"
            className="rounded-full bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90 transition-all duration-200"
            onClick={() => setSearchQuery("Outages in the last 24 hours")}
          >
            Recent outages
          </Button>
          <Button
            variant="outline"
            className="rounded-full bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90 transition-all duration-200"
            onClick={() => setSearchQuery("Critical infrastructure status")}
          >
            Critical status
          </Button>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-md mx-auto">
          <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-xs text-gray-600 mt-1">Resolved Today</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-xs text-gray-600 mt-1">Active Outages</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-xs text-gray-600 mt-1">Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  )
}
