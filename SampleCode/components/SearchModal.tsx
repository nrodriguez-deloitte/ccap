import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Search, Calendar, MessageSquare, Mail, Phone } from 'lucide-react';

// Mock search results
const mockSearchResults = [
  {
    id: 1,
    outage: 'Sydney CBD Fibre Disruption',
    summary: 'Latest update confirms ongoing fiber cable repairs',
    keywords: ['fiber', 'repair', 'Sydney'],
    channels: ['SMS', 'Email', 'Website'],
    date: '2025-01-17 14:30',
    match: 'Communication update regarding fiber repairs in Sydney CBD area'
  },
  {
    id: 2,
    outage: 'Melbourne Network Outage',
    summary: 'Service restoration timeline updated',
    keywords: ['restoration', 'timeline', 'Melbourne'],
    channels: ['ACMA', 'Media'],
    date: '2025-01-17 13:45',
    match: 'ACMA notification sent regarding Melbourne network restoration'
  },
  {
    id: 3,
    outage: 'Brisbane Cable Issue',
    summary: 'Initial incident report filed',
    keywords: ['cable', 'incident', 'Brisbane'],
    channels: ['Internal', 'SMS'],
    date: '2025-01-17 12:15',
    match: 'Cable infrastructure problem reported in Brisbane region'
  },
  {
    id: 4,
    outage: 'Perth Service Disruption',
    summary: 'Customer compensation process initiated',
    keywords: ['compensation', 'customer', 'Perth'],
    channels: ['Email', 'Website'],
    date: '2025-01-17 11:30',
    match: 'Compensation process for affected Perth customers'
  },
  {
    id: 5,
    outage: 'Adelaide Network Issue',
    summary: 'Technical team deployment confirmed',
    keywords: ['technical', 'deployment', 'Adelaide'],
    channels: ['Internal', 'SMS'],
    date: '2025-01-17 10:45',
    match: 'Technical support team dispatched to Adelaide location'
  }
];

// Generate more mock results
const generateMoreResults = () => {
  const templates = [
    'Network maintenance scheduled for {location}',
    'Service restoration complete in {location}',
    'Emergency response team deployed to {location}',
    'Customer notification sent for {location} outage',
    'Technical assessment completed for {location}',
    'Escalation procedures initiated for {location}',
    'Backup systems activated in {location}',
    'Service level agreement reviewed for {location}'
  ];
  
  const locations = ['Darwin', 'Hobart', 'Canberra', 'Gold Coast', 'Newcastle', 'Wollongong', 'Townsville', 'Cairns'];
  const channels = [['SMS', 'Email'], ['Website', 'Social'], ['ACMA', 'Media'], ['Internal'], ['Phone', 'Email']];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: i + 6,
    outage: `${locations[i % locations.length]} Service Alert`,
    summary: templates[i % templates.length].replace('{location}', locations[i % locations.length]),
    keywords: ['service', 'alert', locations[i % locations.length].toLowerCase()],
    channels: channels[i % channels.length],
    date: `2025-01-${String(17 - (i % 15)).padStart(2, '0')} ${String(10 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
    match: `Service alert information for ${locations[i % locations.length]} region`
  }));
};

const allResults = [...mockSearchResults, ...generateMoreResults()];

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Filter results based on search query
    const filtered = allResults.filter(result =>
      result.outage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setResults(filtered);
    setHasSearched(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'SMS': return <MessageSquare className="w-3 h-3" />;
      case 'Email': return <Mail className="w-3 h-3" />;
      case 'Phone': return <Phone className="w-3 h-3" />;
      default: return null;
    }
  };

  const getChannelColor = (channel) => {
    switch (channel) {
      case 'SMS': return 'bg-blue-100 text-blue-800';
      case 'Email': return 'bg-green-100 text-green-800';
      case 'ACMA': return 'bg-purple-100 text-purple-800';
      case 'Media': return 'bg-orange-100 text-orange-800';
      case 'Website': return 'bg-cyan-100 text-cyan-800';
      case 'Internal': return 'bg-gray-100 text-gray-800';
      case 'Phone': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Natural Language Search</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <Input
              placeholder="e.g. What was the latest update for outage ID 12481?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results ({results.length})
                </h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-3">
                {results.map((result) => (
                  <Card key={result.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-gray-900">{result.outage}</h4>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {result.date}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600">{result.summary}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {result.keywords.map((keyword) => (
                            <Badge key={keyword} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Channels:</span>
                          <div className="flex gap-1">
                            {result.channels.map((channel) => (
                              <Badge
                                key={channel}
                                variant="secondary"
                                className={`text-xs ${getChannelColor(channel)} flex items-center gap-1`}
                              >
                                {getChannelIcon(channel)}
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                          <strong>Match:</strong> {result.match}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {results.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}