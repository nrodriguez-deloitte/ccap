import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Map, MapPin, Layers, Filter } from "lucide-react";

export function MapView() {
  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Map Controls */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-800">Network Map</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Layers className="h-4 w-4 mr-2" />
                Layers
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Last updated: 2 min ago</span>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
          <Card className="p-12 bg-white/90 backdrop-blur-sm text-center max-w-md">
            <Map className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Network Map</h3>
            <p className="text-gray-600 mb-6">
              View real-time network status, outage locations, and infrastructure health across your entire network.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  Operational
                </div>
                <span className="font-medium">247 nodes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  Warning
                </div>
                <span className="font-medium">12 nodes</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  Critical
                </div>
                <span className="font-medium">3 nodes</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4">
          <Card className="p-4 bg-white/90 backdrop-blur-sm">
            <h4 className="font-medium mb-2">Legend</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <MapPin className="h-3 w-3 text-green-500 mr-2" />
                Data Centers
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 text-blue-500 mr-2" />
                Network Hubs
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 text-red-500 mr-2" />
                Outage Locations
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}