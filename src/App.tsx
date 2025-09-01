import { useState } from "react";
import { TopNavigation } from "./components/TopNavigation";
import { AISearchView } from "./components/AISearchView";
import { MapView } from "./components/MapView";
import { OutagesView } from "./components/OutagesView";
import { RecordsView } from "./components/RecordsView";
import { TemplatesView } from "./components/TemplatesView";
import { Dashboard } from "./components/Dashboard";
import { ContentAuthoring } from "./components/ContentAuthoring";
import { ApprovalsSystem } from "./components/ApprovalsSystem";
import { WorkflowManagement } from "./components/WorkflowManagement";
import { SearchReporting } from "./components/SearchReporting";

export default function App() {
  const [activeView, setActiveView] = useState("outages");

  const renderActiveView = () => {
    switch (activeView) {
      case "ai-search":
        return <AISearchView />;
      case "map":
        return <MapView />;
      case "outages":
        return <OutagesView />;
      case "records":
        return <RecordsView />;
      case "templates":
        return <TemplatesView />;
      case "create-comms":
        return <ContentAuthoring />;
      // Legacy views for backward compatibility
      case "dashboard":
        return <Dashboard />;
      case "approvals":
        return <ApprovalsSystem />;
      case "workflow":
        return <WorkflowManagement />;
      case "search":
        return <SearchReporting />;
      default:
        return <OutagesView />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <TopNavigation activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-y-auto">
        {renderActiveView()}
      </main>
    </div>
  );
}