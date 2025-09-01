import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Layout, Search, Plus, Copy, Edit } from "lucide-react"

export function TemplatesView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Template Library</h1>
            <p className="text-gray-600">Pre-built templates for communications, workflows, and documentation</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search templates by name, category, or tags..." className="pl-10" />
          </div>
        </Card>

        {/* Template Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Communication Templates */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Layout className="h-8 w-8 text-purple-500" />
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Communications</span>
            </div>
            <h3 className="font-semibold mb-2">Outage Notification</h3>
            <p className="text-sm text-gray-600 mb-4">
              Standard template for notifying customers about network outages and expected resolution times.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Use
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Layout className="h-8 w-8 text-blue-500" />
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Workflow</span>
            </div>
            <h3 className="font-semibold mb-2">Incident Response</h3>
            <p className="text-sm text-gray-600 mb-4">
              Step-by-step workflow for handling network incidents from detection to resolution.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Use
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Layout className="h-8 w-8 text-green-500" />
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Reports</span>
            </div>
            <h3 className="font-semibold mb-2">Monthly Summary</h3>
            <p className="text-sm text-gray-600 mb-4">
              Comprehensive monthly report template covering network performance and incidents.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Use
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Layout className="h-8 w-8 text-orange-500" />
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Communications</span>
            </div>
            <h3 className="font-semibold mb-2">Maintenance Notice</h3>
            <p className="text-sm text-gray-600 mb-4">
              Template for scheduled maintenance notifications with customizable time windows.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Use
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Layout className="h-8 w-8 text-red-500" />
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Emergency</span>
            </div>
            <h3 className="font-semibold mb-2">Emergency Alert</h3>
            <p className="text-sm text-gray-600 mb-4">
              Critical alert template for emergency situations requiring immediate attention.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Use
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Layout className="h-8 w-8 text-indigo-500" />
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">Analysis</span>
            </div>
            <h3 className="font-semibold mb-2">Root Cause Analysis</h3>
            <p className="text-sm text-gray-600 mb-4">
              Structured template for conducting thorough root cause analysis of incidents.
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                <Copy className="h-4 w-4 mr-2" />
                Use
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
