import { Button } from "./ui/button";
import { 
  Search, 
  Map, 
  AlertTriangle, 
  FileText, 
  Layout, 
  Plus,
  Sparkles
} from "lucide-react";

interface TopNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavItem[] = [
  {
    id: "ai-search",
    label: "AI Search",
    icon: <Sparkles className="h-4 w-4" />
  },
  {
    id: "map",
    label: "Map",
    icon: <Map className="h-4 w-4" />
  },
  {
    id: "outages",
    label: "Outages",
    icon: <AlertTriangle className="h-4 w-4" />
  },
  {
    id: "records",
    label: "Records",
    icon: <FileText className="h-4 w-4" />
  },
  {
    id: "templates",
    label: "Templates",
    icon: <Layout className="h-4 w-4" />
  },
  {
    id: "create-comms",
    label: "Create comms",
    icon: <Plus className="h-4 w-4" />
  }
];

export function TopNavigation({ activeView, onViewChange }: TopNavigationProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center space-x-1 py-4">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                activeView === item.id 
                  ? "bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
