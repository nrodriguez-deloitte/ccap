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
  const [activeView, setActiveView] = useState('outages');
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

  const NavigationBar = () => (
    <Box padding="space.400">
      <Inline space="space.400" alignBlock="center">
        {/* AI Search */}
        <Stack space="space.100" alignItems="center">
          <Button 
            appearance={activeView === 'search' ? 'primary' : 'subtle'}
            onClick={() => setActiveView('search')}
          >
            ⭐
          </Button>
          <Text size="small">AI Search</Text>
        </Stack>

        {/* Map */}
        <Stack space="space.100" alignItems="center">
          <Button 
            appearance={activeView === 'map' ? 'primary' : 'subtle'}
            onClick={() => setActiveView('map')}
          >
            📍
          </Button>
          <Text size="small">Map</Text>
        </Stack>

        {/* Outages */}
        <Stack space="space.100" alignItems="center">
          <Button 
            appearance={activeView === 'outages' ? 'primary' : 'subtle'}
            onClick={() => setActiveView('outages')}
          >
            ❗
          </Button>
          <Text size="small">Outages</Text>
        </Stack>

        {/* Records */}
        <Stack space="space.100" alignItems="center">
          <Button 
            appearance={activeView === 'records' ? 'primary' : 'subtle'}
            onClick={() => setActiveView('records')}
          >
            📧
          </Button>
          <Text size="small">Records</Text>
        </Stack>

        {/* Templates */}
        <Stack space="space.100" alignItems="center">
          <Button 
            appearance={activeView === 'templates' ? 'primary' : 'subtle'}
            onClick={() => setActiveView('templates')}
          >
            📄
          </Button>
          <Text size="small">Templates</Text>
        </Stack>

        {/* Create comms */}
        <Stack space="space.100" alignItems="center">
          <Button 
            appearance={activeView === 'create' ? 'primary' : 'subtle'}
            onClick={() => setActiveView('create')}
          >
            ➕
          </Button>
          <Text size="small">Create comms</Text>
        </Stack>
      </Inline>
    </Box>
  );

  const LandingView = () => (
    <Box padding="space.800">
      <Stack space="space.600" alignItems="center">
        
        {/* Central Orb/Logo */}
        <Box padding="space.400">
          <Stack alignItems="center">
            <Text size="xxlarge">🌐</Text>
          </Stack>
        </Box>

        {/* Main Heading */}
        <Stack space="space.200" alignItems="center">
          <Heading size="xlarge">Explore network outages</Heading>
          <Text size="medium">
            Use AI to find details on both open and resolved outages, along with
          </Text>
          <Text size="medium">
            associated communication notifications.
          </Text>
        </Stack>

        {/* Search Bar */}
        <Box padding="space.200">
          <Inline space="space.200" alignBlock="center">
            <TextField
              placeholder="Ask anything about network outages"
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <Button 
              appearance="primary"
              onClick={() => setIsSearchModalOpen(true)}
            >
              🔍
            </Button>
          </Inline>
        </Box>

      </Stack>
    </Box>
  );

  const OutagesView = () => {
    if (loading) {
      return (
        <Box padding="space.400">
          <Stack space="space.200" alignItems="center">
            <Spinner size="large" />
            <Text>Loading outage data...</Text>
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
      <Box padding="space.400">
        <Stack space="space.400">
          
          {/* Header */}
          <Stack space="space.200" alignItems="center">
            <Heading size="large">Network Outages</Heading>
            <Text>Current incidents and service disruptions</Text>
          </Stack>

          {/* Summary Cards */}
          <Inline space="space.300" alignBlock="center">
            <Box padding="space.300">
              <Stack space="space.100" alignItems="center">
                <Text size="large">🚨</Text>
                <Heading size="medium">{outages.length}</Heading>
                <Text size="small">Active Outages</Text>
              </Stack>
            </Box>
            
            <Box padding="space.300">
              <Stack space="space.100" alignItems="center">
                <Text size="large">👥</Text>
                <Heading size="medium">{formatNumber(totalAffected)}</Heading>
                <Text size="small">Affected Customers</Text>
              </Stack>
            </Box>

            <Box padding="space.300">
              <Stack space="space.100" alignItems="center">
                <Text size="large">🏢</Text>
                <Heading size="medium">5</Heading>
                <Text size="small">Regions</Text>
              </Stack>
            </Box>
          </Inline>

          {/* Outage List */}
          <Stack space="space.300">
            <Heading size="medium">Current Incidents</Heading>
            
            <Stack space="space.200">
              {outages.map((outage) => (
                <Button
                  key={outage.id}
                  appearance="subtle"
                  onClick={() => handleOutageSelect(outage)}
                >
                  <Inline space="space.200" alignBlock="center" spread="space-between">
                    <Inline space="space.150" alignBlock="center">
                      <Text size="large">
                        {outage.severity === 'Critical' ? '🔴' : '🟡'}
                      </Text>
                      <Stack space="space.050">
                        <Text weight="medium">{outage.service}</Text>
                        <Text size="small">{outage.region}</Text>
                      </Stack>
                    </Inline>
                    <Inline space="space.100">
                      <Lozenge appearance={
                        outage.severity === 'Critical' ? 'removed' : 'inprogress'
                      }>
                        {outage.severity}
                      </Lozenge>
                      <Text size="small">
                        {formatNumber(parseInt(outage.impactedCustomers?.replace(/,/g, '') || '0'))} affected
                      </Text>
                    </Inline>
                  </Inline>
                </Button>
              ))}
            </Stack>
          </Stack>

        </Stack>
      </Box>
    );
  };

  const MapView = () => (
    <Box padding="space.400">
      <Stack space="space.400" alignItems="center">
        <Heading size="large">Network Status Map</Heading>
        <Text>Interactive map view coming soon...</Text>
        <Text size="large">🗺️</Text>
      </Stack>
    </Box>
  );

  const SearchView = () => (
    <Box padding="space.400">
      <Stack space="space.400" alignItems="center">
        <Heading size="large">AI Search</Heading>
        <Text>Intelligent search functionality coming soon...</Text>
        <Text size="large">🤖</Text>
      </Stack>
    </Box>
  );

  const RecordsView = () => (
    <Box padding="space.400">
      <Stack space="space.400" alignItems="center">
        <Heading size="large">Communication Records</Heading>
        <Text>Message history and templates coming soon...</Text>
        <Text size="large">📧</Text>
      </Stack>
    </Box>
  );

  const TemplatesView = () => (
    <Box padding="space.400">
      <Stack space="space.400" alignItems="center">
        <Heading size="large">Message Templates</Heading>
        <Text>Pre-built communication templates coming soon...</Text>
        <Text size="large">📄</Text>
      </Stack>
    </Box>
  );

  const CreateView = () => (
    <Box padding="space.400">
      <Stack space="space.400" alignItems="center">
        <Heading size="large">Create Communications</Heading>
        <Text>Message creation tools coming soon...</Text>
        <Text size="large">✏️</Text>
      </Stack>
    </Box>
  );

  return (
    <Box>
      {/* Top Navigation */}
      <NavigationBar />
      
      {/* Main Content */}
      {activeView === 'outages' && <LandingView />}
      {activeView === 'map' && <MapView />}
      {activeView === 'search' && <SearchView />}
      {activeView === 'records' && <RecordsView />}
      {activeView === 'templates' && <TemplatesView />}
      {activeView === 'create' && <CreateView />}
      {activeView === 'outages-list' && <OutagesView />}

      {/* Search Modal */}
      {isSearchModalOpen && (
        <Modal onClose={() => setIsSearchModalOpen(false)}>
          <Stack space="space.400">
            <Heading size="medium">AI Search</Heading>
            
            <TextField
              placeholder="Ask anything about network outages"
              value={searchQuery}
              onChange={setSearchQuery}
            />
            
            <Stack space="space.200">
              <Text weight="medium">Search Results</Text>
              {searchQuery ? (
                <Text>Searching for: "{searchQuery}"</Text>
              ) : (
                <Text>Enter a question to search outage data...</Text>
              )}
            </Stack>
            
            <Inline space="space.200">
              <Button appearance="primary" onClick={() => setIsSearchModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => setActiveView('outages-list')}>
                View All Outages
              </Button>
            </Inline>
          </Stack>
        </Modal>
      )}

      {/* Outage Details Modal */}
      {isDetailsPanelOpen && selectedOutage && (
        <Modal onClose={() => setIsDetailsPanelOpen(false)}>
          <Stack space="space.400">
            <Stack space="space.200">
              <Heading size="medium">Outage Details</Heading>
              <Lozenge appearance={
                selectedOutage.severity === 'Critical' ? 'removed' : 'inprogress'
              }>
                {selectedOutage.severity}
              </Lozenge>
            </Stack>
            
            <Stack space="space.200">
              <Stack space="space.100">
                <Text weight="medium">Service</Text>
                <Text>{selectedOutage.service}</Text>
              </Stack>
              
              <Stack space="space.100">
                <Text weight="medium">Description</Text>
                <Text>{selectedOutage.description}</Text>
              </Stack>
              
              <Stack space="space.100">
                <Text weight="medium">Location</Text>
                <Text>{selectedOutage.region}</Text>
              </Stack>
              
              <Stack space="space.100">
                <Text weight="medium">Customer Impact</Text>
                <Text>{selectedOutage.impactedCustomers} customers affected</Text>
              </Stack>
              
              <Stack space="space.100">
                <Text weight="medium">Stage</Text>
                <Badge text={`Stage ${selectedOutage.stage}`} />
              </Stack>
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
