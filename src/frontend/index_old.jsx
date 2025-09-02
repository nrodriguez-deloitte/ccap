import React, { useState, useEffect } from 'react';
import ForgeReconciler, { 
  Text,
  Heading,
  Button,
  Box,
  Stack,
  Badge,
  Lozenge,
  Spinner,
  TextField,
  Modal,
  Inline
} from '@forge/react';
import { invoke } from '@forge/bridge';

const OutageDashboard = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedOutage, setSelectedOutage] = useState(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const outageData = await invoke('getActiveOutages');
        const outages = outageData?.data || outageData || [];
        setOutages(outages);
      } catch (error) {
        console.error('Error fetching data:', error);
        setOutages([
          {
            id: 'OUT-001',
            service: 'Sydney CBD Fibre Disruption',
            description: 'Major fibre cable cut affecting internet and phone services across Sydney CBD',
            severity: 'Critical',
            region: 'Sydney Metro',
            impactedCustomers: '120,000',
            stage: 3
          },
          {
            id: 'OUT-002',
            service: 'Melbourne Network Maintenance',
            description: 'Scheduled maintenance affecting mobile services in Melbourne metropolitan area',
            severity: 'Major',
            region: 'Melbourne Metro',
            impactedCustomers: '85,000',
            stage: 2
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box padding="space.400">
        <Stack space="space.200">
          <Spinner size="large" />
          <Text>Loading CAP Dashboard...</Text>
        </Stack>
      </Box>
    );
  }

  const totalAffected = outages.reduce((sum, outage) => {
    const customers = parseInt(outage.impactedCustomers?.replace(/,/g, '') || '0');
    return sum + customers;
  }, 0);

  const formatNumber = (num) => num.toLocaleString();

  const handleOutageSelect = (outage) => {
    setSelectedOutage(outage);
    setIsDetailsPanelOpen(true);
  };

  return (
    <Box>
      <Inline space="space.300">
        {/* Sidebar */}
        <Box padding="space.300">
          <Stack space="space.300">
            <Stack space="space.200">
              <Heading size="large">CAP</Heading>
              <Text>Communications Assurance Platform</Text>
            </Stack>
            
            <Stack space="space.200">
              <Button appearance="primary">📊 Dashboard</Button>
              <Button appearance="subtle">📋 Activity Log</Button>
              <Button appearance="subtle">✅ Approvals</Button>
              <Button appearance="subtle" onClick={() => setIsSearchModalOpen(true)}>🔍 Search</Button>
            </Stack>
          </Stack>
        </Box>

        {/* Main Content */}
        <Box padding="space.400">
          <Stack space="space.400">
            
            {/* Header */}
            <Stack space="space.200">
              <Heading size="large">Australia Network Status</Heading>
              <Text>Real-time monitoring and incident management</Text>
            </Stack>

            {/* Summary Cards */}
            <Inline space="space.300">
              <Box padding="space.200">
                <Stack space="space.100">
                  <Text size="large">🚨</Text>
                  <Heading size="medium">{outages.length}</Heading>
                  <Text size="small">Active Outages</Text>
                </Stack>
              </Box>
              
              <Box padding="space.200">
                <Stack space="space.100">
                  <Text size="large">👥</Text>
                  <Heading size="medium">{formatNumber(totalAffected)}</Heading>
                  <Text size="small">Affected Customers</Text>
                </Stack>
              </Box>

              <Box padding="space.200">
                <Stack space="space.100">
                  <Text size="large">🏢</Text>
                  <Heading size="medium">5</Heading>
                  <Text size="small">Regions</Text>
                </Stack>
              </Box>
            </Inline>

            {/* Network Map */}
            <Box padding="space.300">
              <Stack space="space.300">
                <Heading size="medium">🗺️ Network Status Map</Heading>
                
                <Stack space="space.200">
                  {outages.map((outage) => (
                    <Button
                      key={outage.id}
                      appearance="subtle"
                      onClick={() => handleOutageSelect(outage)}
                    >
                      <Inline space="space.150">
                        <Text>{outage.severity === 'Critical' ? '🔴' : '🟡'}</Text>
                        <Stack space="space.050">
                          <Text weight="medium">{outage.service}</Text>
                          <Text size="small">{outage.region}</Text>
                        </Stack>
                        <Lozenge appearance={
                          outage.severity === 'Critical' ? 'removed' : 'inprogress'
                        }>
                          {outage.severity}
                        </Lozenge>
                      </Inline>
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </Box>

          </Stack>
        </Box>
      </Inline>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <Modal onClose={() => setIsSearchModalOpen(false)}>
          <Stack space="space.300">
            <Heading size="medium">🔍 Search Dashboard</Heading>
            <TextField
              placeholder="Search outages, regions, services..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <Button appearance="primary" onClick={() => setIsSearchModalOpen(false)}>
              Close
            </Button>
          </Stack>
        </Modal>
      )}

      {/* Outage Details Modal */}
      {isDetailsPanelOpen && selectedOutage && (
        <Modal onClose={() => setIsDetailsPanelOpen(false)}>
          <Stack space="space.300">
            <Heading size="medium">Outage Details</Heading>
            <Stack space="space.200">
              <Text weight="medium">Service: {selectedOutage.service}</Text>
              <Text>Description: {selectedOutage.description}</Text>
              <Text>Location: {selectedOutage.region}</Text>
              <Text>Impact: {selectedOutage.impactedCustomers} customers</Text>
              <Lozenge appearance={
                selectedOutage.severity === 'Critical' ? 'removed' : 'inprogress'
              }>
                {selectedOutage.severity}
              </Lozenge>
            </Stack>
            <Button appearance="primary" onClick={() => setIsDetailsPanelOpen(false)}>
              Close
            </Button>
          </Stack>
        </Modal>
      )}
    </Box>
  );
};

ForgeReconciler.render(<OutageDashboard />);
