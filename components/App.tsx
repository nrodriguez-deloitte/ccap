"use client"

import { useState } from "react"
import { Sidebar } from "./legal-case/Sidebar"
import { TopNavigation } from "./legal-case/TopNavigation"
import { AISearchView } from "./legal-case/AISearchView"
import { MapView } from "./legal-case/MapView"
import { OutagesView } from "./legal-case/OutagesView"
import { RecordsView } from "./legal-case/RecordsView"
import { TemplatesView } from "./legal-case/TemplatesView"
import { Dashboard } from "./legal-case/Dashboard"
import { ContentAuthoring } from "./legal-case/ContentAuthoring"
import { ApprovalsSystem } from "./legal-case/ApprovalsSystem"
import { WorkflowManagement } from "./legal-case/WorkflowManagement"
import { SearchReporting } from "./legal-case/SearchReporting"

export default function App() {
  const [activeView, setActiveView] = useState("dashboard")

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
      case "authoring":
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
        )
      case "help":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <p>Help documentation coming soon...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="h-screen flex bg-white">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 flex flex-col">
        <TopNavigation activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 overflow-y-auto">{renderActiveView()}</main>
      </div>
    </div>
  )
}
