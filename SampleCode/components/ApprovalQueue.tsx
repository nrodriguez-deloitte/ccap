import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  Filter,
  Eye,
  MessageSquare,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

// Mock approval queue data
const mockApprovals = [
  {
    id: 1,
    outageId: 'OUT-2025-001',
    channel: 'Media Team',
    template: 'Website Update v0.2',
    approver: 'Sarah Johnson',
    timePending: '2h 15m',
    priority: 'High',
    content: 'Website banner update for Sydney CBD outage notification'
  },
  {
    id: 2,
    outageId: 'OUT-2025-002',
    channel: 'ACMA',
    template: 'ACMA Report v0.1',
    approver: 'Mike Wilson',
    timePending: '4h 30m',
    priority: 'Major',
    content: 'Regulatory notification for Melbourne network disruption'
  },
  {
    id: 3,
    outageId: 'OUT-2025-003',
    channel: 'Consumer SMS',
    template: 'SMS Stage 2 v0.3',
    approver: 'Lisa Chen',
    timePending: '1h 45m',
    priority: 'Medium',
    content: 'SMS notification for Brisbane cable issue'
  },
  {
    id: 4,
    outageId: 'OUT-2025-004',
    channel: 'Email Marketing',
    template: 'Email Stage 3 v0.4',
    approver: 'David Brown',
    timePending: '3h 20m',
    priority: 'Low',
    content: 'Email update for Perth service disruption'
  },
  {
    id: 5,
    outageId: 'OUT-2025-005',
    channel: 'Social Media',
    template: 'Social Post v0.1',
    approver: 'Anna Davis',
    timePending: '30m',
    priority: 'High',
    content: 'Social media post about Adelaide network issue'
  }
];

// Generate additional mock approvals
const generateAdditionalApprovals = () => {
  const channels = ['Media Team', 'ACMA', 'Consumer SMS', 'Email Marketing', 'Social Media', 'Website', 'Phone Support', 'Internal Comms'];
  const templates = ['SMS v0.1', 'Email v0.2', 'Website v0.3', 'Social v0.1', 'ACMA v0.2', 'Media v0.1', 'Phone v0.1'];
  const approvers = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Chen', 'David Brown', 'Anna Davis', 'Tom Wilson', 'Emma Johnson'];
  const priorities = ['Major', 'High', 'Medium', 'Low'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: i + 6,
    outageId: `OUT-2025-${String(i + 6).padStart(3, '0')}`,
    channel: channels[i % channels.length],
    template: templates[i % templates.length],
    approver: approvers[i % approvers.length],
    timePending: `${Math.floor(Math.random() * 8) + 1}h ${Math.floor(Math.random() * 60)}m`,
    priority: priorities[i % priorities.length],
    content: `Communication approval required for outage ${i + 6}`
  }));
};

const allApprovals = [...mockApprovals, ...generateAdditionalApprovals()];

export function ApprovalQueue() {
  const [approvals, setApprovals] = useState(allApprovals);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredApprovals = approvals.filter(approval => {
    const matchesSearch = approval.outageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         approval.approver.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'all' || approval.channel === channelFilter;
    const matchesPriority = priorityFilter === 'all' || approval.priority === priorityFilter;
    
    return matchesSearch && matchesChannel && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Major': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'Consumer SMS': return <MessageSquare className="w-4 h-4" />;
      case 'Email Marketing': return <Mail className="w-4 h-4" />;
      case 'Phone Support': return <Phone className="w-4 h-4" />;
      case 'Website': return <Globe className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleApprove = (id) => {
    setApprovals(approvals.filter(approval => approval.id !== id));
  };

  const handleReject = (id) => {
    setApprovals(approvals.filter(approval => approval.id !== id));
  };

  const uniqueChannels = [...new Set(allApprovals.map(approval => approval.channel))];
  const uniquePriorities = [...new Set(allApprovals.map(approval => approval.priority))];

  return (
    <div className="h-full p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Approval Queue</h1>
            <p className="text-gray-600">Communications awaiting human approval</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
              {filteredApprovals.length} Pending
            </Badge>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by outage ID, channel, or approver..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  {uniqueChannels.map(channel => (
                    <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {uniquePriorities.map(priority => (
                    <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Approval Table */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Outage ID</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Approver</TableHead>
                  <TableHead>Time Pending</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-medium">{approval.outageId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getChannelIcon(approval.channel)}
                        {approval.channel}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                        {approval.template}
                      </Button>
                    </TableCell>
                    <TableCell>{approval.approver}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        {approval.timePending}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getPriorityColor(approval.priority)}>
                        {approval.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* Preview functionality */}}
                          className="gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(approval.id)}
                          className="gap-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(approval.id)}
                          className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="w-3 h-3" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredApprovals.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No approvals found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}