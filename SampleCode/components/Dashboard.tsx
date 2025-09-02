import { useState } from 'react';
import { Search, MapPin, Users, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { SearchModal } from './SearchModal';
import { OutageDetailsPanel } from './OutageDetailsPanel';
import { ImageWithFallback } from './figma/ImageWithFallback';
import australiaMap from 'figma:asset/7b925d88684ad399f9036a08aa7e4bb71fdd1554.png';

// Mock data
const outages = [
  {
    id: 1,
    name: 'Sydney CBD Fibre Disruption',
    location: 'Sydney Metro',
    customers: 120000,
    stage: 'Stage 3',
    priority: 'Major',
    coordinates: { x: 82, y: 78 },
    description: 'Network connectivity issue in Sydney CBD area',
    reporter: 'John Smith',
    email: 'john.smith@company.com',
    serviceType: 'Internet',
    version: '1.2',
    environment: 'Production'
  },
  {
    id: 2,
    name: 'Melbourne Network Outage',
    location: 'Melbourne Metro',
    customers: 85000,
    stage: 'Stage 2',
    priority: 'High',
    coordinates: { x: 72, y: 85 },
    description: 'Widespread network disruption affecting Melbourne area',
    reporter: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    serviceType: 'Internet',
    version: '1.1',
    environment: 'Production'
  },
  {
    id: 3,
    name: 'Brisbane Cable Issue',
    location: 'Brisbane Metro',
    customers: 45000,
    stage: 'Stage 1',
    priority: 'Medium',
    coordinates: { x: 79, y: 52 },
    description: 'Cable infrastructure problem in Brisbane region',
    reporter: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    serviceType: 'Cable',
    version: '1.0',
    environment: 'Production'
  },
  {
    id: 4,
    name: 'Perth Service Disruption',
    location: 'Perth Metro',
    customers: 32000,
    stage: 'Stage 4',
    priority: 'Low',
    coordinates: { x: 25, y: 75 },
    description: 'Service interruption affecting Perth customers',
    reporter: 'Lisa Chen',
    email: 'lisa.chen@company.com',
    serviceType: 'Internet',
    version: '1.3',
    environment: 'Production'
  },
  {
    id: 5,
    name: 'Adelaide Network Issue',
    location: 'Adelaide Metro',
    customers: 28000,
    stage: 'Stage 2',
    priority: 'Medium',
    coordinates: { x: 68, y: 82 },
    description: 'Network connectivity problems in Adelaide area',
    reporter: 'David Brown',
    email: 'david.brown@company.com',
    serviceType: 'Internet',
    version: '1.1',
    environment: 'Production'
  }
];

export function Dashboard() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedOutage, setSelectedOutage] = useState(null);
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false);
  const [hoveredPin, setHoveredPin] = useState(null);

  const stageCounts = {
    'Stage 1': outages.filter(o => o.stage === 'Stage 1').length,
    'Stage 2': outages.filter(o => o.stage === 'Stage 2').length,
    'Stage 3': outages.filter(o => o.stage === 'Stage 3').length,
    'Stage 4': outages.filter(o => o.stage === 'Stage 4').length,
  };

  const handleOutageSelect = (outage) => {
    setSelectedOutage(outage);
    setDetailsPanelOpen(true);
  };

  const getStageColor = (stage) => {
    switch (stage) {
      case 'Stage 1': return 'bg-red-100 text-red-800';
      case 'Stage 2': return 'bg-orange-100 text-orange-800';
      case 'Stage 3': return 'bg-yellow-100 text-yellow-800';
      case 'Stage 4': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Major': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full flex">
      {/* Left Side - Map View */}
      <div className="flex-1 p-6 relative">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full relative overflow-hidden">
          <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Australia Network Status</h2>
          </div>
          
          <div className="absolute top-4 right-4 z-10">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchModalOpen(true)}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
            </div>
          </div>

          <div className="w-full h-full flex items-center justify-center p-8">
            <div className="relative max-w-2xl w-full">
              <ImageWithFallback
                src={australiaMap}
                alt="Australia Map"
                className="w-full h-auto"
              />
              
              {/* Outage Pins */}
              {outages.map((outage) => (
                <div
                  key={outage.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${outage.coordinates.x}%`,
                    top: `${outage.coordinates.y}%`,
                  }}
                  onMouseEnter={() => setHoveredPin(outage.id)}
                  onMouseLeave={() => setHoveredPin(null)}
                  onClick={() => handleOutageSelect(outage)}
                >
                  <div className="relative">
                    <MapPin className="w-6 h-6 text-red-500 hover:text-red-700 transition-colors" />
                    
                    {/* Floating Preview Card */}
                    {hoveredPin === outage.id && (
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg border border-gray-200 w-64 z-20">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-gray-900">{outage.name}</h3>
                            <Badge variant="secondary" className={getPriorityColor(outage.priority)}>
                              {outage.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{outage.location}</p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={getStageColor(outage.stage)}>
                              {outage.stage}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {outage.customers.toLocaleString()} customers
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Outage Summary & Cards */}
      <div className="w-96 p-6 border-l border-gray-200">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Outage Summary</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Open Outages</p>
                    <p className="text-xl font-semibold text-gray-900">{outages.length}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Affected Customers</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {outages.reduce((sum, outage) => sum + outage.customers, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Outages by Stage */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Outages by Stage</h3>
              <div className="space-y-2">
                {Object.entries(stageCounts).map(([stage, count]) => (
                  <div key={stage} className="flex justify-between items-center">
                    <Badge variant="outline" className={getStageColor(stage)}>
                      {stage}
                    </Badge>
                    <span className="text-sm text-gray-600">{count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Outage Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Outages</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {outages.map((outage) => (
                <Card
                  key={outage.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOutageSelect(outage)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-900">{outage.name}</h4>
                      <Badge variant="secondary" className={getPriorityColor(outage.priority)}>
                        {outage.priority}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{outage.location}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className={getStageColor(outage.stage)}>
                          {outage.stage}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {outage.customers.toLocaleString()} affected
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals and Panels */}
      <SearchModal open={searchModalOpen} onOpenChange={setSearchModalOpen} />
      <OutageDetailsPanel
        outage={selectedOutage}
        open={detailsPanelOpen}
        onOpenChange={setDetailsPanelOpen}
      />
    </div>
  );
}