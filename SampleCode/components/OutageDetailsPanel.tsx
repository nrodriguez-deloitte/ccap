import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { 
  AlertTriangle, 
  Users, 
  MapPin, 
  Globe, 
  User, 
  Mail, 
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Send
} from 'lucide-react';

// Mock communication activities
const mockActivities = [
  {
    id: 1,
    channel: 'SMS',
    status: 'Sent',
    template: 'SMS Stage 3 v0.3',
    timestamp: '2025-01-17 14:30',
    content: 'We are aware of a service disruption affecting Sydney CBD area. Updates to follow.'
  },
  {
    id: 2,
    channel: 'Email',
    status: 'Sent',
    template: 'Email Stage 3 v0.2',
    timestamp: '2025-01-17 14:25',
    content: 'Service disruption notification - Sydney CBD Fibre Network'
  },
  {
    id: 3,
    channel: 'Website',
    status: 'Pending Approval',
    template: 'Website Update v0.4',
    timestamp: '2025-01-17 14:20',
    content: 'Website banner update for Sydney CBD outage'
  },
  {
    id: 4,
    channel: 'ACMA',
    status: 'Draft',
    template: 'ACMA Report v0.1',
    timestamp: '2025-01-17 14:15',
    content: 'Regulatory notification draft for major service disruption'
  },
  {
    id: 5,
    channel: 'Media',
    status: 'Sent',
    template: 'Media Release v0.2',
    timestamp: '2025-01-17 14:10',
    content: 'Press release regarding Sydney CBD network maintenance'
  }
];

interface OutageDetailsPanelProps {
  outage: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OutageDetailsPanel({ outage, open, onOpenChange }: OutageDetailsPanelProps) {
  if (!outage) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Sent': return <Send className="w-3 h-3" />;
      case 'Pending Approval': return <Clock className="w-3 h-3" />;
      case 'Draft': return <MessageSquare className="w-3 h-3" />;
      default: return <MessageSquare className="w-3 h-3" />;
    }
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[1000px] sm:w-[1000px] overflow-y-auto px-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Outage Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{outage.name}</span>
                <div className="flex gap-2">
                  <Badge variant="secondary" className={getPriorityColor(outage.priority)}>
                    {outage.priority}
                  </Badge>
                  <Badge variant="outline" className={getStageColor(outage.stage)}>
                    {outage.stage}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{outage.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{outage.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{outage.customers.toLocaleString()} customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{outage.serviceType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{outage.reporter}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Reporter:</span>
                  <p className="text-gray-600">{outage.reporter}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Team:</span>
                  <p className="text-gray-600">Network</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Service Type:</span>
                  <p className="text-gray-600">{outage.serviceType}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Version:</span>
                  <p className="text-gray-600">{outage.version}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Environment:</span>
                  <p className="text-gray-600">{outage.environment}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Source:</span>
                  <p className="text-gray-600">Network Outage Dashboard</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communication Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Communication Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockActivities.map((activity, index) => (
                  <div key={activity.id}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{activity.channel}</p>
                            <p className="text-sm text-gray-500">{activity.template}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className={`${getStatusColor(activity.status)} flex items-center gap-1`}>
                              {getStatusIcon(activity.status)}
                              {activity.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {activity.content}
                        </p>
                      </div>
                    </div>
                    {index < mockActivities.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}