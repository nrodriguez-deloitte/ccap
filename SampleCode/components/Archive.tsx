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
  Search, 
  Filter,
  Download,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  Globe,
  Users,
  Building
} from 'lucide-react';

// Mock archive data
const mockArchiveData = [
  {
    id: 1,
    customerId: 'CUST-001-2025',
    channel: 'Consumer',
    template: 'SMS Stage 2 v0.3',
    dateSent: '2025-01-17 14:30',
    outageId: 'OUT-2025-001',
    geography: 'Sydney Metro',
    priority: 'Major',
    status: 'Delivered'
  },
  {
    id: 2,
    customerId: 'CUST-002-2025',
    channel: 'Public',
    template: 'Website Update v0.2',
    dateSent: '2025-01-17 14:25',
    outageId: 'OUT-2025-002',
    geography: 'Melbourne Metro',
    priority: 'High',
    status: 'Published'
  },
  {
    id: 3,
    customerId: 'CUST-003-2025',
    channel: 'Stakeholder',
    template: 'Email Stage 3 v0.4',
    dateSent: '2025-01-17 14:20',
    outageId: 'OUT-2025-003',
    geography: 'Brisbane Metro',
    priority: 'Medium',
    status: 'Sent'
  },
  {
    id: 4,
    customerId: 'CUST-004-2025',
    channel: 'Consumer',
    template: 'Phone Script v0.1',
    dateSent: '2025-01-17 14:15',
    outageId: 'OUT-2025-004',
    geography: 'Perth Metro',
    priority: 'Low',
    status: 'Completed'
  },
  {
    id: 5,
    customerId: 'CUST-005-2025',
    channel: 'Public',
    template: 'Social Media v0.2',
    dateSent: '2025-01-17 14:10',
    outageId: 'OUT-2025-005',
    geography: 'Adelaide Metro',
    priority: 'Medium',
    status: 'Posted'
  }
];

// Generate additional mock archive data
const generateAdditionalArchiveData = () => {
  const channels = ['Consumer', 'Public', 'Stakeholder', 'Internal', 'Media', 'Regulatory'];
  const templates = ['SMS v0.1', 'Email v0.2', 'Website v0.3', 'Social v0.1', 'Phone v0.1', 'ACMA v0.2'];
  const geographies = ['Sydney Metro', 'Melbourne Metro', 'Brisbane Metro', 'Perth Metro', 'Adelaide Metro', 'Darwin', 'Hobart', 'Canberra'];
  const priorities = ['Major', 'High', 'Medium', 'Low'];
  const statuses = ['Delivered', 'Sent', 'Published', 'Posted', 'Completed', 'Failed'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: i + 6,
    customerId: `CUST-${String(i + 6).padStart(3, '0')}-2025`,
    channel: channels[i % channels.length],
    template: templates[i % templates.length],
    dateSent: `2025-01-${String(17 - Math.floor(i / 3)).padStart(2, '0')} ${String(10 + (i % 14)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
    outageId: `OUT-2025-${String(i + 6).padStart(3, '0')}`,
    geography: geographies[i % geographies.length],
    priority: priorities[i % priorities.length],
    status: statuses[i % statuses.length]
  }));
};

const allArchiveData = [...mockArchiveData, ...generateAdditionalArchiveData()];

export function Archive() {
  const [archiveData, setArchiveData] = useState(allArchiveData);
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState('all');
  const [geographyFilter, setGeographyFilter] = useState('all');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [outageIdFilter, setOutageIdFilter] = useState('');

  const filteredData = archiveData.filter(item => {
    const matchesSearch = item.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.outageId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = channelFilter === 'all' || item.channel === channelFilter;
    const matchesGeography = geographyFilter === 'all' || item.geography === geographyFilter;
    const matchesOutageId = !outageIdFilter || item.outageId.toLowerCase().includes(outageIdFilter.toLowerCase());
    
    // Date filtering (simplified)
    let matchesDateRange = true;
    if (dateFromFilter || dateToFilter) {
      const itemDate = new Date(item.dateSent);
      if (dateFromFilter) {
        matchesDateRange = matchesDateRange && itemDate >= new Date(dateFromFilter);
      }
      if (dateToFilter) {
        matchesDateRange = matchesDateRange && itemDate <= new Date(dateToFilter);
      }
    }
    
    return matchesSearch && matchesChannel && matchesGeography && matchesOutageId && matchesDateRange;
  });

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'Consumer': return 'bg-blue-100 text-blue-800';
      case 'Public': return 'bg-green-100 text-green-800';
      case 'Stakeholder': return 'bg-purple-100 text-purple-800';
      case 'Internal': return 'bg-gray-100 text-gray-800';
      case 'Media': return 'bg-orange-100 text-orange-800';
      case 'Regulatory': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Published': return 'bg-purple-100 text-purple-800';
      case 'Posted': return 'bg-orange-100 text-orange-800';
      case 'Completed': return 'bg-teal-100 text-teal-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'Consumer': return <Users className="w-4 h-4" />;
      case 'Public': return <Globe className="w-4 h-4" />;
      case 'Stakeholder': return <Building className="w-4 h-4" />;
      case 'Internal': return <MessageSquare className="w-4 h-4" />;
      case 'Media': return <MessageSquare className="w-4 h-4" />;
      case 'Regulatory': return <Building className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Customer ID', 'Channel', 'Template Used', 'Date Sent', 'Outage ID', 'Geography', 'Priority', 'Status'],
      ...filteredData.map(item => [
        item.customerId,
        item.channel,
        item.template,
        item.dateSent,
        item.outageId,
        item.geography,
        item.priority,
        item.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `communications-archive-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueChannels = [...new Set(allArchiveData.map(item => item.channel))];
  const uniqueGeographies = [...new Set(allArchiveData.map(item => item.geography))];

  return (
    <div className="h-full p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Communications Archive</h1>
            <p className="text-gray-600">Structured history of all communications sent</p>
          </div>
          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="xl:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search customer ID, template, outage ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={channelFilter} onValueChange={setChannelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Channels</SelectItem>
                  {uniqueChannels.map(channel => (
                    <SelectItem key={channel} value={channel}>{channel}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={geographyFilter} onValueChange={setGeographyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Geography" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueGeographies.map(geography => (
                    <SelectItem key={geography} value={geography}>{geography}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                placeholder="From Date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />

              <Input
                type="date"
                placeholder="To Date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
            </div>
            
            <div className="mt-4">
              <Input
                placeholder="Filter by Outage ID..."
                value={outageIdFilter}
                onChange={(e) => setOutageIdFilter(e.target.value)}
                className="max-w-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Showing {filteredData.length} of {allArchiveData.length} communications
          </p>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-800">
              {filteredData.filter(item => item.status === 'Delivered').length} Delivered
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-800">
              {filteredData.filter(item => item.status === 'Sent').length} Sent
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-800">
              {filteredData.filter(item => item.status === 'Failed').length} Failed
            </Badge>
          </div>
        </div>

        {/* Archive Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Template Used</TableHead>
                  <TableHead>Date Sent</TableHead>
                  <TableHead>Outage ID</TableHead>
                  <TableHead>Geography</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.customerId}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getChannelIcon(item.channel)}
                        <Badge variant="secondary" className={getChannelColor(item.channel)}>
                          {item.channel}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800">
                        {item.template}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        {item.dateSent}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.outageId}</Badge>
                    </TableCell>
                    <TableCell>{item.geography}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No communications found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}