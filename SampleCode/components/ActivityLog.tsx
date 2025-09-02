import { useEffect, useState } from 'react';
import { invoke } from '@forge/bridge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { 
  Users, 
  MapPin, 
  Globe, 
  User, 
  Mail, 
  Calendar,
  MessageSquare,
  Send,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

// No local mock outages; load from backend

// Mock activity data
const mockActivities = [
  {
    id: 1,
    channel: 'SMS',
    status: 'Sent',
    template: 'SMS Stage 3 v0.3',
    timestamp: '2025-01-17 14:30',
    content: 'We are aware of a service disruption affecting your area. Updates to follow.'
  },
  {
    id: 2,
    channel: 'Email',
    status: 'Sent',
    template: 'Email Stage 3 v0.2',
    timestamp: '2025-01-17 14:25',
    content: 'Service disruption notification - Network maintenance in progress'
  },
  {
    id: 3,
    channel: 'Website',
    status: 'Pending Approval',
    template: 'Website Update v0.4',
    timestamp: '2025-01-17 14:20',
    content: 'Website banner update for service disruption'
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
    content: 'Press release regarding network maintenance'
  }
];

export function ActivityLog() {
  const [outages, setOutages] = useState<any[]>([]);
  const [selectedOutage, setSelectedOutage] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res: any = await invoke('resolver', { action: 'fetchOutages', params: { maxResults: 25 } });
        if (mounted) {
          if (res?.ok) {
            const mapped = (res.items || []).map((it: any) => ({
              id: it.id,
              name: it.summary || it.key,
              location: it.location || '—',
              customers: 0,
              stage: 'Stage 1',
              priority: it.priority || '—',
              description: `Status: ${it.status || '—'}`,
              reporter: '—',
              email: '—',
              serviceType: it.type || '—',
              version: '',
              environment: ''
            }));
            setOutages(mapped);
            setSelectedOutage(mapped[0] || null);
          } else {
            setError(res?.error || 'Failed to load outages');
          }
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load outages');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

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

  return (
    <div className="h-full flex">
      {/* Left Column - Activity Log + Outage Details */}
      <div className="flex-1 p-6 space-y-6">
        {/* Selected Outage Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {loading ? (
                <span className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading outage...
                </span>
              ) : selectedOutage ? (
                <>
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    {selectedOutage.name}
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className={getPriorityColor(selectedOutage.priority)}>
                      {selectedOutage.priority}
                    </Badge>
                    <Badge variant="outline" className={getStageColor(selectedOutage.stage)}>
                      {selectedOutage.stage}
                    </Badge>
                  </div>
                </>
              ) : (
                <span className="text-gray-600">No outage selected</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Fetching details...
              </div>
            ) : selectedOutage ? (
              <>
                <p className="text-gray-600 mb-4">{selectedOutage.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{selectedOutage.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{(selectedOutage.customers || 0).toLocaleString()} customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{selectedOutage.serviceType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{selectedOutage.reporter}</span>
                  </div>
                </div>
              </>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : (
              <p className="text-gray-600">No outage details to display.</p>
            )}
          </CardContent>
        </Card>

        {/* Activity List */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
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
                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                          {activity.content}
                        </p>
                      </div>
                    </div>
                    {index < mockActivities.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Outage List */}
      <div className="w-96 p-6 border-l border-gray-200">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>All Outages</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-full">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-gray-600">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading outages...
                </div>
              ) : outages.length === 0 ? (
                <p className="text-sm text-gray-600">No outages found.</p>
              ) : (
                <div className="space-y-3">
                  {outages.map((outage) => (
                    <Card
                      key={outage.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedOutage && selectedOutage.id === outage.id
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedOutage(outage)}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-900 leading-tight">{outage.name}</h4>
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
                              {(outage.customers || 0).toLocaleString()} customers
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}