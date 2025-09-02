import Resolver from '@forge/resolver';

const resolver = new Resolver();

// Mock data for outages
const mockOutages = [
  {
    id: 'OUT-001',
    name: 'Sydney CBD Fibre Disruption',
    location: 'Sydney Metro',
    impactedCustomers: 120000,
    stage: 'Stage 3',
    priority: 'Major',
    status: 'Active',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    description: 'Major fibre cable cut affecting internet and phone services across Sydney CBD',
    reporter: { name: 'John Smith', email: 'john.smith@company.com' },
    serviceType: 'Internet',
    source: 'Network Outage Dashboard',
    environment: 'Production',
    version: 'v1.2.3',
    createdAt: '2025-07-22T10:00:00Z',
    commsActivity: [
      { id: 1, channel: 'SMS', status: 'Sent', template: 'SMS Stage 3 v0.3', time: '2025-07-22 14:30', recipient: 'Customers' },
      { id: 2, channel: 'Email', status: 'Pending Approval', template: 'Email Update v1.2', time: '2025-07-22 15:00', recipient: 'Stakeholders' },
      { id: 3, channel: 'Website', status: 'Draft', template: 'Website Update v0.2', time: '2025-07-22 15:15', recipient: 'Public' },
      { id: 4, channel: 'ACMA', status: 'Sent', template: 'ACMA Notification v1.0', time: '2025-07-22 11:00', recipient: 'Regulator' }
    ]
  },
  {
    id: 'OUT-002',
    name: 'Melbourne Network Maintenance',
    location: 'Melbourne Metro',
    impactedCustomers: 85000,
    stage: 'Stage 2',
    priority: 'Medium',
    status: 'Active',
    coordinates: { lat: -37.8136, lng: 144.9631 },
    description: 'Scheduled maintenance affecting mobile services in Melbourne metropolitan area',
    reporter: { name: 'Sarah Johnson', email: 'sarah.johnson@company.com' },
    serviceType: 'Mobile',
    source: 'Maintenance Portal',
    environment: 'Production',
    version: 'v2.1.0',
    createdAt: '2025-07-22T08:00:00Z',
    commsActivity: [
      { id: 1, channel: 'SMS', status: 'Sent', template: 'SMS Stage 2 v0.1', time: '2025-07-22 12:00', recipient: 'Customers' },
      { id: 2, channel: 'Email', status: 'Sent', template: 'Email Maintenance v2.1', time: '2025-07-22 12:05', recipient: 'Customers' }
    ]
  },
  {
    id: 'OUT-003',
    name: 'Brisbane Power Outage Impact',
    location: 'Brisbane North',
    impactedCustomers: 45000,
    stage: 'Stage 1',
    priority: 'High',
    status: 'Active',
    coordinates: { lat: -27.4698, lng: 153.0251 },
    description: 'External power outage affecting network equipment and causing service disruptions',
    reporter: { name: 'Mike Chen', email: 'mike.chen@company.com' },
    serviceType: 'Internet',
    source: 'Network Operations',
    environment: 'Production',
    version: 'v1.5.2',
    createdAt: '2025-07-22T16:00:00Z',
    commsActivity: [
      { id: 1, channel: 'SMS', status: 'Draft', template: 'SMS Stage 1 v1.0', time: '2025-07-22 16:00', recipient: 'Customers' }
    ]
  }
];

// Additional mock outages for fuller dataset
const additionalOutages = [
  { id: 'OUT-004', name: 'Perth Cable Fault', location: 'Perth Metro', impactedCustomers: 32000, stage: 'Stage 4', priority: 'Low', status: 'Resolved' },
  { id: 'OUT-005', name: 'Adelaide Mobile Tower', location: 'Adelaide Hills', impactedCustomers: 18000, stage: 'Stage 2', priority: 'Medium', status: 'Active' },
  { id: 'OUT-006', name: 'Gold Coast Fibre', location: 'Gold Coast', impactedCustomers: 67000, stage: 'Stage 3', priority: 'High', status: 'Active' },
  { id: 'OUT-007', name: 'Darwin Network Issue', location: 'Darwin', impactedCustomers: 12000, stage: 'Stage 1', priority: 'Medium', status: 'Monitoring' },
  { id: 'OUT-008', name: 'Hobart Service Disruption', location: 'Hobart', impactedCustomers: 8500, stage: 'Stage 2', priority: 'Low', status: 'Active' },
  { id: 'OUT-009', name: 'Canberra Data Center', location: 'Canberra', impactedCustomers: 25000, stage: 'Stage 1', priority: 'High', status: 'Active' },
  { id: 'OUT-010', name: 'Newcastle Maintenance', location: 'Newcastle', impactedCustomers: 41000, stage: 'Stage 3', priority: 'Medium', status: 'Scheduled' }
];

const allOutages = [...mockOutages, ...additionalOutages];

// Mock approvals data
const mockApprovals = [
  { 
    id: 'APP-001', 
    outageId: 'OUT-001', 
    channel: 'Media Team', 
    template: 'Website Update v0.2', 
    approver: 'Lisa Wong', 
    timePending: '2h 30m',
    priority: 'High',
    submittedBy: 'John Smith',
    submittedAt: '2025-07-22T13:30:00Z'
  },
  { 
    id: 'APP-002', 
    outageId: 'OUT-002', 
    channel: 'SMS', 
    template: 'SMS Update v1.1', 
    approver: 'David Lee', 
    timePending: '45m',
    priority: 'Medium',
    submittedBy: 'Sarah Johnson',
    submittedAt: '2025-07-22T14:15:00Z'
  },
  { 
    id: 'APP-003', 
    outageId: 'OUT-003', 
    channel: 'Email', 
    template: 'Email Alert v2.0', 
    approver: 'Emma Wilson', 
    timePending: '1h 15m',
    priority: 'High',
    submittedBy: 'Mike Chen',
    submittedAt: '2025-07-22T13:45:00Z'
  }
];

// Mock archive data
const mockArchiveData = Array.from({ length: 50 }, (_, i) => ({
  id: `ARCH-${String(i + 1).padStart(3, '0')}`,
  customerId: `CUST-${String(i + 1).padStart(4, '0')}`,
  channel: ['Consumer', 'Public', 'Stakeholder', 'Regulator'][i % 4],
  template: `Template v${Math.floor(i / 10) + 1}.${i % 10}`,
  dateSent: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  outageId: allOutages[i % allOutages.length].id,
  geography: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'][i % 8],
  status: ['Delivered', 'Failed', 'Pending'][i % 3],
  messageType: ['Alert', 'Update', 'Resolution', 'Maintenance'][i % 4]
}));

// Resolver functions
resolver.define('getOutages', (req) => {
  const { status, priority, location } = req.payload || {};
  
  let filteredOutages = allOutages;
  
  if (status) {
    filteredOutages = filteredOutages.filter(o => o.status === status);
  }
  
  if (priority) {
    filteredOutages = filteredOutages.filter(o => o.priority === priority);
  }
  
  if (location) {
    filteredOutages = filteredOutages.filter(o => 
      o.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  return {
    success: true,
    data: filteredOutages,
    count: filteredOutages.length
  };
});

resolver.define('getOutageById', (req) => {
  const { outageId } = req.payload;
  const outage = allOutages.find(o => o.id === outageId);
  
  if (!outage) {
    return {
      success: false,
      error: 'Outage not found'
    };
  }
  
  return {
    success: true,
    data: outage
  };
});

resolver.define('getApprovals', (req) => {
  const { status, priority } = req.payload || {};
  
  let filteredApprovals = mockApprovals;
  
  if (status) {
    filteredApprovals = filteredApprovals.filter(a => a.status === status);
  }
  
  if (priority) {
    filteredApprovals = filteredApprovals.filter(a => a.priority === priority);
  }
  
  return {
    success: true,
    data: filteredApprovals,
    count: filteredApprovals.length
  };
});

resolver.define('getArchiveData', (req) => {
  const { customerId, location, outageId, dateFrom, dateTo, limit = 50, offset = 0 } = req.payload || {};
  
  let filteredData = mockArchiveData;
  
  if (customerId) {
    filteredData = filteredData.filter(d => d.customerId.includes(customerId));
  }
  
  if (location) {
    filteredData = filteredData.filter(d => d.geography === location);
  }
  
  if (outageId) {
    filteredData = filteredData.filter(d => d.outageId === outageId);
  }
  
  if (dateFrom) {
    filteredData = filteredData.filter(d => d.dateSent >= dateFrom);
  }
  
  if (dateTo) {
    filteredData = filteredData.filter(d => d.dateSent <= dateTo);
  }
  
  const paginatedData = filteredData.slice(offset, offset + limit);
  
  return {
    success: true,
    data: paginatedData,
    total: filteredData.length,
    limit,
    offset
  };
});

resolver.define('searchCommunications', (req) => {
  const { query } = req.payload;
  
  if (!query) {
    return {
      success: false,
      error: 'Search query is required'
    };
  }
  
  // Simple search simulation
  const searchResults = allOutages
    .filter(outage => 
      outage.name.toLowerCase().includes(query.toLowerCase()) ||
      outage.description.toLowerCase().includes(query.toLowerCase()) ||
      outage.id.toLowerCase().includes(query.toLowerCase())
    )
    .map(outage => ({
      outageId: outage.id,
      outage: outage.name,
      summary: `Communications for ${outage.name}`,
      keywords: query.toLowerCase().split(' '),
      channels: outage.commsActivity.map(c => c.channel),
      date: outage.createdAt.split('T')[0],
      relevanceScore: Math.random()
    }))
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
    
  return {
    success: true,
    data: searchResults,
    query,
    count: searchResults.length
  };
});

resolver.define('getDashboardStats', (req) => {
  const activeOutages = allOutages.filter(o => o.status === 'Active');
  const totalCustomersAffected = activeOutages.reduce((sum, o) => sum + o.impactedCustomers, 0);
  
  const stageDistribution = {
    'Stage 1': activeOutages.filter(o => o.stage === 'Stage 1').length,
    'Stage 2': activeOutages.filter(o => o.stage === 'Stage 2').length,
    'Stage 3': activeOutages.filter(o => o.stage === 'Stage 3').length,
    'Stage 4': activeOutages.filter(o => o.stage === 'Stage 4').length
  };
  
  const priorityDistribution = {
    'High': activeOutages.filter(o => o.priority === 'High').length,
    'Medium': activeOutages.filter(o => o.priority === 'Medium').length,
    'Low': activeOutages.filter(o => o.priority === 'Low').length,
    'Major': activeOutages.filter(o => o.priority === 'Major').length
  };
  
  return {
    success: true,
    data: {
      activeOutages: activeOutages.length,
      totalCustomersAffected,
      stageDistribution,
      priorityDistribution,
      pendingApprovals: mockApprovals.length,
      recentActivity: allOutages.slice(0, 5)
    }
  };
});

// Legacy function for backward compatibility
resolver.define('getText', (req) => {
  return 'CAP - Communications Assurance Platform Backend Active';
});

export const handler = resolver.getDefinitions();
