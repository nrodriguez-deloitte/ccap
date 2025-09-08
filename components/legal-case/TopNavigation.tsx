"use client"

import type React from "react"
import { Button } from "../ui/button"
import { Map, AlertTriangle, FileText, Layout, Plus, Sparkles } from "lucide-react"

// Adaptive label for the third tab based on demo mode
type DemoMode = "outages" | "bids" | "communications" | "complaints"
const demoMode: DemoMode = (process.env.NEXT_PUBLIC_DEMO_MODE as DemoMode) || "outages"

interface TopNavigationProps {
  activeView: string
  onViewChange: (view: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

// Map demo mode to a user-facing label & icon (keep id 'outages' so rest of app logic remains unchanged)
function getModeTab(): NavItem {
  switch (demoMode) {
    case "bids":
      return { id: "outages", label: "Bids", icon: <FileText className="h-4 w-4" /> }
    case "communications":
      return { id: "outages", label: "Communications", icon: <FileText className="h-4 w-4" /> }
    case "complaints":
      return { id: "outages", label: "Complaints", icon: <AlertTriangle className="h-4 w-4" /> }
    case "outages":
    default:
      return { id: "outages", label: "Outages", icon: <AlertTriangle className="h-4 w-4" /> }
  }
}

const navigationItems: NavItem[] = [
  { id: "ai-search", label: "AI Search", icon: <Sparkles className="h-4 w-4" /> },
  { id: "map", label: "Map", icon: <Map className="h-4 w-4" /> },
  { id: "records", label: "Records", icon: <FileText className="h-4 w-4" /> },
  { id: "templates", label: "Templates", icon: <Layout className="h-4 w-4" /> },
  { id: "create-comms", label: "Create comms", icon: <Plus className="h-4 w-4" /> },
]

export function TopNavigation({ activeView, onViewChange }: TopNavigationProps) {
  const handleNavigation = (viewId: string) => {
    onViewChange(viewId)
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center space-x-1 py-4">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all cursor-pointer ${
                activeView === item.id
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => handleNavigation(item.id)}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
