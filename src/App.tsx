"use client"

import { useState } from "react"
import { Sidebar } from "./components/Sidebar" // Added Sidebar import
import { TopNavigation } from "./components/TopNavigation"
import { AISearchView } from "./components/AISearchView"
import { MapView } from "./components/MapView"
import { OutagesView } from "./components/OutagesView"
import { RecordsView } from "./components/RecordsView"
import { TemplatesView } from "./components/TemplatesView"
import { Dashboard } from "./components/Dashboard"
import { ContentAuthoring } from "./components/ContentAuthoring"
import { ApprovalsSystem } from "./components/ApprovalsSystem"
import { WorkflowManagement } from "./components/WorkflowManagement"
import { SearchReporting } from "./components/SearchReporting"

export default function App() {
  const [activeView, setActiveView] = useState("dashboard") // Changed default to dashboard to match Sidebar navigation

  const renderActiveView = () => {
    switch (activeView) {
      case "ai-search":
        return <AISearchView />
      case "map":
        return <MapView />
      case "outages":
        return <OutagesView />
      case "records":
        return <RecordsView />
      case "templates":
        return <TemplatesView />
      case "create-comms":
      case "authoring": // Added authoring case to match Sidebar navigation
        return <ContentAuthoring />
      case "dashboard":
        return <Dashboard />
      case "approvals":
        return <ApprovalsSystem />
      case "workflow":
        return <WorkflowManagement />
      case "search":
        return <SearchReporting />
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p>Settings page coming soon...</p>
          </div>
        ) // Added settings placeholder
      case "help":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <p>Help documentation coming soon...</p>
          </div>
        ) // Added help placeholder
      default:
        return <Dashboard /> // Changed default to Dashboard
    }
  }

  return (
    <div className="h-screen flex bg-white">
      {" "}
      {/* Changed to horizontal flex layout */}
      <Sidebar activeView={activeView} onViewChange={setActiveView} /> {/* Added Sidebar with proper props */}
      <div className="flex-1 flex flex-col">
        <TopNavigation activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-y-auto">{renderActiveView()}</main>
      </div>
    </div>
  )
}
