"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent } from "../ui/card"
import { Search, Sparkles, MessageSquare, FileText, Users, Calendar } from "lucide-react"

export function AISearchView() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Hi, Welcome! 👋</h1>
          <p className="text-muted-foreground">Ready to explore your legal case management system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">24</p>
                  <p className="text-sm text-muted-foreground">Active Cases</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">8</p>
                  <p className="text-sm text-muted-foreground">Pending Reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-card-foreground">156</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border shadow-lg rounded-xl overflow-hidden">
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
                <p className="text-muted-foreground max-w-xl mx-auto">
                  Use natural language to search across all your workflows, documents, and communications with
                  intelligent AI assistance.
                </p>
              </div>

              {/* Search Input */}
              <div className="relative max-w-lg mx-auto">
                <Input
                  type="text"
                  placeholder="Ask me anything about your work..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-4 text-lg rounded-full border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 bg-background shadow-sm"
                />
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <Search className="h-5 w-5 text-primary-foreground" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border shadow-sm rounded-xl hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Recent Cases</h3>
              <p className="text-sm text-muted-foreground">View your latest case files</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm rounded-xl hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mx-auto">
                <MessageSquare className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-card-foreground">Communications</h3>
              <p className="text-sm text-muted-foreground">Manage client communications</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm rounded-xl hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold text-card-foreground">Team</h3>
              <p className="text-sm text-muted-foreground">Collaborate with colleagues</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm rounded-xl hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6 text-chart-4" />
              </div>
              <h3 className="font-semibold text-card-foreground">Schedule</h3>
              <p className="text-sm text-muted-foreground">View upcoming deadlines</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
