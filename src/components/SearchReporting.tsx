import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  FileText, 
  User, 
  Calendar as CalendarIcon,
  MoreVertical,
  History,
  Archive
} from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "case" | "document" | "communication" | "workflow";
  status: string;
  author: string;
  lastModified: string;
  version: string;
  tags: string[];
  recipients?: string[];
}

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  ipAddress: string;
}

const mockSearchResults: SearchResult[] = [
  {
    id: "DOC-001",
    title: "Employment Contract - Senior Developer Position",
    type: "document",
    status: "Final",
    author: "Sarah Chen",
    lastModified: "2025-08-28 14:30",
    version: "v2.1",
    tags: ["contract", "employment", "senior-level"],
    recipients: ["client@techcorp.com", "hr@company.com"]
  },
  {
    id: "CASE-001", 
    title: "GDPR Compliance Assessment - EU Client",
    type: "case",
    status: "In Progress",
    author: "Michael Torres",
    lastModified: "2025-08-28 11:15",
    version: "v1.3",
    tags: ["gdpr", "compliance", "eu", "data-protection"]
  },
  {
    id: "COMM-001",
    title: "Client Update - Partnership Agreement Status",
    type: "communication",
    status: "Sent",
    author: "Lisa Wang",
    lastModified: "2025-08-27 16:45",
    version: "v1.0",
    tags: ["client-update", "partnership"],
    recipients: ["client@startup.com", "legal@startup.com"]
  },
  {
    id: "WF-001",
    title: "Contract Review Workflow - TechCorp",
    type: "workflow",
    status: "Active",
    author: "James Miller",
    lastModified: "2025-08-28 09:20",
    version: "v1.0",
    tags: ["workflow", "contract-review"]
  }
];

const mockAuditTrail: AuditEntry[] = [
  {
    id: "AUDIT-001",
    timestamp: "2025-08-28 14:30:15",
    user: "Sarah Chen",
    action: "Document Modified",
    entity: "Employment Contract",
    entityId: "DOC-001",
    details: "Updated termination clauses in section 8.2",
    ipAddress: "192.168.1.45"
  },
  {
    id: "AUDIT-002",
    timestamp: "2025-08-28 14:25:08",
    user: "Michael Torres",
    action: "Document Reviewed",
    entity: "Employment Contract", 
    entityId: "DOC-001",
    details: "Completed legal review, approved with minor changes",
    ipAddress: "192.168.1.67"
  },
  {
    id: "AUDIT-003",
    timestamp: "2025-08-28 11:15:22",
    user: "Lisa Wang",
    action: "Case Status Updated",
    entity: "GDPR Assessment",
    entityId: "CASE-001", 
    details: "Status changed from 'Draft' to 'In Progress'",
    ipAddress: "192.168.1.23"
  },
  {
    id: "AUDIT-004",
    timestamp: "2025-08-27 16:45:33",
    user: "System",
    action: "Communication Sent",
    entity: "Client Update",
    entityId: "COMM-001",
    details: "Email sent to 2 recipients",
    ipAddress: "10.0.0.1"
  }
];

export function SearchReporting() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [dateRange, setDateRange] = useState<Date | undefined>(undefined);
  const [searchResults, setSearchResults] = useState(mockSearchResults);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "case": return "bg-blue-100 text-blue-800";
      case "document": return "bg-green-100 text-green-800";
      case "communication": return "bg-purple-100 text-purple-800";
      case "workflow": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string, type: string) => {
    if (type === "communication") {
      return status === "Sent" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    }
    switch (status.toLowerCase()) {
      case "final": 
      case "completed":
      case "active": return "bg-green-100 text-green-800";
      case "in progress":
      case "review": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearch = () => {
    // In a real app, this would make an API call with filters
    console.log("Searching with:", { searchQuery, selectedType, selectedStatus, dateRange });
  };

  const exportResults = () => {
    // In a real app, this would generate and download a report
    console.log("Exporting search results");
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Records & Reporting</h1>
        <p className="text-muted-foreground">
          Search through work records and communications with full audit trails and reporting
        </p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList>
          <TabsTrigger value="search">Search & Filter</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          {/* Search Filters */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search cases, documents, communications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">Filters:</span>
                </div>
                
                <select 
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="case">Cases</option>
                  <option value="document">Documents</option>
                  <option value="communication">Communications</option>
                  <option value="workflow">Workflows</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="in-progress">In Progress</option>
                  <option value="final">Final</option>
                  <option value="archived">Archived</option>
                </select>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Date Range
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange}
                      onSelect={setDateRange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Button variant="outline" onClick={exportResults}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </Card>

          {/* Search Results */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Search Results ({searchResults.length})</h2>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>

            <div className="space-y-3">
              {searchResults.map((result) => (
                <div key={result.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-medium">{result.title}</h3>
                        <Badge className={getTypeColor(result.type)}>
                          {result.type}
                        </Badge>
                        <Badge className={getStatusColor(result.status, result.type)}>
                          {result.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {result.version}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {result.author}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {result.lastModified}
                        </div>
                        {result.recipients && (
                          <div>
                            Recipients: {result.recipients.length}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {result.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <History className="h-4 w-4 mr-1" />
                        History
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2>Audit Trail</h2>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAuditTrail.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-mono text-sm">
                        {entry.timestamp}
                      </TableCell>
                      <TableCell>{entry.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{entry.entity}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.entityId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{entry.details}</p>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {entry.ipAddress}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                  <h3>Document Activity Report</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track document creation, modifications, and approvals over time
                </p>
                <Button size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-green-500" />
                  <h3>User Activity Report</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Monitor user actions, login patterns, and access history
                </p>
                <Button size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Archive className="h-6 w-6 text-purple-500" />
                  <h3>Compliance Report</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Regulatory compliance summary with audit trail references
                </p>
                <Button size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-6 w-6 text-orange-500" />
                  <h3>SLA Performance Report</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Track workflow SLA compliance and bottleneck analysis
                </p>
                <Button size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <History className="h-6 w-6 text-red-500" />
                  <h3>Version Control Report</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Document version history and change tracking summary
                </p>
                <Button size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-6 w-6 text-indigo-500" />
                  <h3>Custom Report</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Build custom reports with specific filters and date ranges
                </p>
                <Button size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Build Report
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}