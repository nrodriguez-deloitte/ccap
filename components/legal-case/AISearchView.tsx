"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import {
  Search,
  Sparkles,
  MessageSquare,
  FileText,
  Users,
  Calendar,
  AlertTriangle,
  DollarSign,
  Inbox,
  BarChart3,
  Mail,
  Layers,
  Map as LucideMap,
} from "lucide-react"
import AiChat from "../AiChat"

// Adaptive AI search experience based on demo mode
type DemoMode = "outages" | "bids" | "communications" | "complaints"
const demoMode: DemoMode = (process.env.NEXT_PUBLIC_DEMO_MODE as DemoMode) || "outages"

interface StatCard {
  value: string
  label: string
  icon: React.ReactNode
  color: string // tailwind color keyword used for bg/text utilities
}

interface FeatureCard {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

interface ModeConfig {
  tagline: string
  longDescription: string
  stats: StatCard[]
  features: FeatureCard[]
  suggestions: string[]
  placeholder: string
}

const MODE_CONFIG: Record<DemoMode, ModeConfig> = {
  outages: {
    tagline: "Intelligent outage analysis and insights",
    longDescription:
      "Ask natural language questions about active incidents, historical outage trends, notification compliance and customer impact.",
    stats: [
      { value: "6", label: "Active Incidents", icon: <AlertTriangle className="h-6 w-6" />, color: "primary" },
      { value: "92%", label: "Comms Compliance", icon: <Mail className="h-6 w-6" />, color: "secondary" },
      { value: "37m", label: "Impacted Services", icon: <Layers className="h-6 w-6" />, color: "accent" },
    ],
    features: [
      { title: "Recent Incidents", description: "Summaries & SLA progress", icon: <AlertTriangle className="h-6 w-6" />, color: "primary" },
      { title: "Notification Quality", description: "Channel delivery metrics", icon: <Mail className="h-6 w-6" />, color: "secondary" },
      { title: "Customer Impact", description: "Affected region breakdown", icon: <Users className="h-6 w-6" />, color: "accent" },
      { title: "Trend Analysis", description: "Patterns & recurrence", icon: <BarChart3 className="h-6 w-6" />, color: "chart-4" },
    ],
    suggestions: [
      "Show me incidents with compliance risk this week",
      "Which outages exceeded stage 2 notification thresholds?",
      "Summarize customer impact by region for the last 24 hours",
    ],
    placeholder: "Ask about incidents, compliance or impact...",
  },
  bids: {
    tagline: "Funding opportunity intelligence & bid performance",
    longDescription:
      "Explore bid pipeline status, awarded amounts, review stages and regional strategy performance.",
    stats: [
      { value: "14", label: "Active Bids", icon: <FileText className="h-6 w-6" />, color: "primary" },
      { value: "$82M", label: "In Review", icon: <DollarSign className="h-6 w-6" />, color: "secondary" },
      { value: "7", label: "Awarded", icon: <Sparkles className="h-6 w-6" />, color: "accent" },
    ],
    features: [
      { title: "Pipeline", description: "Draft → Awarded flow", icon: <Layers className="h-6 w-6" />, color: "primary" },
      { title: "Financial Outlook", description: "Total & weighted value", icon: <DollarSign className="h-6 w-6" />, color: "secondary" },
  { title: "Regional Coverage", description: "Strategic distribution", icon: <LucideMap className="h-6 w-6" />, color: "accent" },
      { title: "Review Efficiency", description: "Cycle time insights", icon: <BarChart3 className="h-6 w-6" />, color: "chart-4" },
    ],
    suggestions: [
      "Show bid conversion rate by category",
      "Which bids are stuck in review longest?",
      "Summarize awarded value by region",
    ],
    placeholder: "Ask about pipeline, value or review cycles...",
  },
  communications: {
    tagline: "Unified messaging intelligence & campaign insights",
    longDescription:
      "Query active, draft and historical communication artifacts across channels, audiences and outcomes.",
    stats: [
      { value: "28", label: "Active Campaigns", icon: <MessageSquare className="h-6 w-6" />, color: "primary" },
      { value: "164k", label: "Total Sends", icon: <Mail className="h-6 w-6" />, color: "secondary" },
      { value: "12%", label: "CTR (Rolling)", icon: <Sparkles className="h-6 w-6" />, color: "accent" },
    ],
    features: [
      { title: "Channel Mix", description: "Email / SMS / Portal", icon: <Inbox className="h-6 w-6" />, color: "primary" },
      { title: "Audience Segments", description: "Engagement variance", icon: <Users className="h-6 w-6" />, color: "secondary" },
      { title: "Template Health", description: "Reuse & freshness", icon: <FileText className="h-6 w-6" />, color: "accent" },
      { title: "Performance Trends", description: "Opens and conversions", icon: <BarChart3 className="h-6 w-6" />, color: "chart-4" },
    ],
    suggestions: [
      "List campaigns with declining engagement",
      "Compare SMS vs email performance last 7 days",
      "Which audience segments have highest open rate?",
    ],
    placeholder: "Ask about campaigns, channels or engagement...",
  },
  complaints: {
    tagline: "Case resolution intelligence & SLA tracking",
    longDescription:
      "Investigate complaint volume, resolution velocity, SLA exposure and emerging thematic signals.",
    stats: [
      { value: "312", label: "Open Cases", icon: <Inbox className="h-6 w-6" />, color: "primary" },
      { value: "87%", label: "On-Time SLA", icon: <Sparkles className="h-6 w-6" />, color: "secondary" },
      { value: "5.4h", label: "Median Response", icon: <ClockIcon /> as any, color: "accent" },
    ],
    features: [
      { title: "Volume Drivers", description: "Category distribution", icon: <Layers className="h-6 w-6" />, color: "primary" },
      { title: "SLA Exposure", description: "Upcoming breaches", icon: <AlertTriangle className="h-6 w-6" />, color: "secondary" },
      { title: "Resolution Quality", description: "Escalation patterns", icon: <Users className="h-6 w-6" />, color: "accent" },
      { title: "Thematic Trends", description: "Emerging topics", icon: <BarChart3 className="h-6 w-6" />, color: "chart-4" },
    ],
    suggestions: [
      "Show categories with highest reopen rate",
      "Which regions are closest to SLA breach?",
      "Summarize escalation trends this week",
    ],
    placeholder: "Ask about SLA, categories or escalations...",
  },
}

// Fallback icon for complaints median response (not used elsewhere)
function ClockIcon() {
  return <Calendar className="h-6 w-6" />
}

export function AISearchView() {
  const cfg = MODE_CONFIG[demoMode]
  const [searchQuery, setSearchQuery] = useState("")
  const [showChat, setShowChat] = useState(false)
  const [initialQuery, setInitialQuery] = useState<string | undefined>()

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setInitialQuery(searchQuery)
      setShowChat(true)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (showChat) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between p-6 border-b bg-white">
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Search</h1>
              <p className="text-muted-foreground">{cfg.tagline}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setShowChat(false)
                setSearchQuery("")
                setInitialQuery(undefined)
              }}
            >
              Back to Search
            </Button>
          </div>
          <div className="p-6">
            <AiChat initialQuery={initialQuery} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Hi, Welcome! 👋</h1>
          <p className="text-muted-foreground">{cfg.longDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cfg.stats.map((s, i) => (
            <Card key={i} className="bg-card border-border shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-${s.color}/10 flex items-center justify-center`}>{s.icon}</div>
                  <div>
                    <p className="text-2xl font-bold text-card-foreground">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card border-border shadow-sm rounded-xl overflow-hidden">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* AI Icon */}
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-card-foreground">AI-Powered Search</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">{cfg.tagline}</p>
              </div>

              {/* Search Input */}
              <div className="relative max-w-lg mx-auto">
                <Input
                  type="text"
                  placeholder={cfg.placeholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-4 pr-12 py-4 text-lg rounded-full border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 bg-background shadow-sm"
                />
                <Button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Search className="h-5 w-5 text-primary-foreground" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {cfg.suggestions.map(s => (
            <button
              key={s}
              onClick={() => { setSearchQuery(s); setInitialQuery(s); setShowChat(true) }}
              className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cfg.features.map((f, i) => (
            <Card key={i} className="bg-card border-border shadow-sm rounded-xl hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center space-y-3">
                <div className={`w-12 h-12 rounded-lg bg-${f.color}/10 flex items-center justify-center mx-auto`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-card-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
