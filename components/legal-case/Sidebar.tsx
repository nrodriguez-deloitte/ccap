"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  Workflow,
  Search,
  Settings,
  User,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  badge?: number
  description: string
}

const navigationItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    description: "Overview of cases and workflow status",
  },
  {
    id: "authoring",
    label: "Content Co-authoring",
    icon: <FileText className="h-5 w-5" />,
    description: "Draft content with AI and precedent libraries",
  },
  {
    id: "approvals",
    label: "Approvals Co-pilot",
    icon: <CheckCircle className="h-5 w-5" />,
    badge: 3,
    description: "Review and approve with risk detection",
  },
  {
    id: "workflow",
    label: "Workflow Management",
    icon: <Workflow className="h-5 w-5" />,
    badge: 5,
    description: "Track stages, SLAs, and governance gates",
  },
  {
    id: "search",
    label: "Search & Reporting",
    icon: <Search className="h-5 w-5" />,
    description: "Find cases and generate compliance reports",
  },
]

const secondaryItems: NavItem[] = [
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
    description: "System configuration and preferences",
  },
  {
    id: "help",
    label: "Help & Support",
    icon: <HelpCircle className="h-5 w-5" />,
    description: "Documentation and support resources",
  },
]

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? "w-16" : "w-72"}`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold text-gray-900">LegalFlow</h1>
                <p className="text-xs text-gray-500">Case Management System</p>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-3 ${isCollapsed ? "px-3" : ""}`}
                onClick={() => onViewChange(item.id)}
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="flex items-center space-x-3 flex-1">
                    {item.icon}
                    {!isCollapsed && (
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            ))}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {secondaryItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start h-auto p-3 ${isCollapsed ? "px-3" : ""}`}
              onClick={() => onViewChange(item.id)}
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="flex items-center space-x-3 flex-1">
                  {item.icon}
                  {!isCollapsed && (
                    <div className="flex-1 text-left">
                      <span className="font-medium">{item.label}</span>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className={`flex items-center space-x-3 ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Sarah Chen</p>
                <p className="text-xs text-gray-500">Senior Legal Counsel</p>
              </div>
            )}
            {!isCollapsed && (
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
