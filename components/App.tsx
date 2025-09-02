"use client"

import { useEffect, useState } from "react"
import { TopNavigation } from "./legal-case/TopNavigation"
import { AISearchView } from "./legal-case/AISearchView"
import { MapView } from "./legal-case/MapView"
import { OutagesView } from "./legal-case/OutagesView"
import { RecordsView } from "./legal-case/RecordsView"
import { TemplatesView } from "./legal-case/TemplatesView"
import { ContentAuthoring } from "./legal-case/ContentAuthoring"
import { ApprovalsSystem } from "./legal-case/ApprovalsSystem"
import { WorkflowManagement } from "./legal-case/WorkflowManagement"
import { SearchReporting } from "./legal-case/SearchReporting"

export default function App() {
  const [activeView, setActiveView] = useState(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.slice(1) // Remove the # symbol
      return hash || "ai-search"
    }
    return "ai-search"
  })

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "ai-search"
      setActiveView(hash)
    }

    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  const handleViewChange = (view: string) => {
    setActiveView(view)
    window.location.hash = view
  }

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
        return <AISearchView />
    }
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <TopNavigation activeView={activeView} onViewChange={handleViewChange} />
      <main className="flex-1 overflow-y-auto pb-5">{renderActiveView()}</main>
    </div>
  )
}
