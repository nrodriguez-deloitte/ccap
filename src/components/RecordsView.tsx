import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FileText, Search, Filter, Download } from "lucide-react";

export function RecordsView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Records & Archive</h1>
          <p className="text-gray-600">
            Search and manage all your work records, communications, and documentation
          </p>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search records, communications, documents..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </Card>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Records */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <h3 className="font-semibold mb-2">Network Incident Report #{i}</h3>
              <p className="text-sm text-gray-600 mb-4">
                Detailed analysis of the network outage that occurred in the eastern region affecting multiple customers.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Incident Report
                </span>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}