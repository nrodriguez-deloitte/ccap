import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Search, Sparkles, Zap } from "lucide-react";

export function AISearchView() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* AI Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-2xl">
            <Sparkles className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
            AI-Powered Search
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Use natural language to search across all your workflows, documents, 
            and communications with intelligent AI assistance.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-lg mx-auto">
          <Input
            type="text"
            placeholder="Ask me anything about your work..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-12 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 bg-white/90 backdrop-blur-sm shadow-lg"
          />
          <Button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            size="sm"
          >
            <Search className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* AI Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Zap className="h-6 w-6 text-purple-600" />
              <h3>Smart Insights</h3>
            </div>
            <p className="text-sm text-gray-600">
              Get intelligent summaries and insights from your data
            </p>
          </Card>
          
          <Card className="p-6 bg-white/70 backdrop-blur-sm border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Search className="h-6 w-6 text-indigo-600" />
              <h3>Contextual Search</h3>
            </div>
            <p className="text-sm text-gray-600">
              Find exactly what you need with context-aware search
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
