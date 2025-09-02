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

  const TopNavigation = () => (
    <Box padding="space.300">
      <Inline space="space.300">
        <Button 
          appearance={activeView === 'dashboard' ? 'primary' : 'subtle'}
          onClick={() => setActiveView('dashboard')}
        >
          Dashboard
        </Button>
        <Button 
          appearance={activeView === 'search' ? 'primary' : 'subtle'}
          onClick={() => setActiveView('search')}
        >
          AI Search
        </Button>
        <Button 
          appearance={activeView === 'map' ? 'primary' : 'subtle'}
          onClick={() => setActiveView('map')}
        >
          Map
        </Button>
        <Button 
          appearance={activeView === 'outages' ? 'primary' : 'subtle'}
          onClick={() => setActiveView('outages')}
        >
          Outages
        </Button>
        <Button 
          appearance={activeView === 'records' ? 'primary' : 'subtle'}
          onClick={() => setActiveView('records')}
        >
          Records
        </Button>
      </Inline>
    </Box>
  );

  const LandingPage = () => (
    <Box padding="space.600">
      <Stack space="space.400">
        
        <Box padding="space.300">
          <Text>🌐</Text>
        </Box>

        <Stack space="space.200">
          <Heading>Explore network outages</Heading>
          <Text>Use AI to find details on both open and resolved outages, along with associated communication notifications.</Text>
        </Stack>

        <Box padding="space.200">
          <Stack space="space.200">
            <TextField
              placeholder="Ask anything about network outages"
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <Button 
              appearance="primary"
              onClick={() => setIsSearchModalOpen(true)}
            >
              Search
            </Button>
          </Stack>
        </Box>

      </Stack>
    </Box>
  );

  const OutagesPage = () => {
    if (loading) {
      return (
        <Box padding="space.400">
          <Stack space="space.200">
            <Spinner />
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
          
          <Stack space="space.200">
            <Heading>Network Outages</Heading>
            <Text>Current incidents and service disruptions</Text>
          </Stack>

          <Inline space="space.300">
            <Box padding="space.300">
              <Stack space="space.100">
                <Text>🚨</Text>
                <Heading>{outages.length}</Heading>
                <Text>Active Outages</Text>
              </Stack>
            </Box>
            
            <Box padding="space.300">
              <Stack space="space.100">
                <Text>👥</Text>
                <Heading>{formatNumber(totalAffected)}</Heading>
                <Text>Affected Customers</Text>
              </Stack>
            </Box>

            <Box padding="space.300">
              <Stack space="space.100">
                <Text>🏢</Text>
                <Heading>5</Heading>
                <Text>Regions</Text>
              </Stack>
            </Box>
          </Inline>

          <Stack space="space.300">
            <Heading>Current Incidents</Heading>
            
            <Stack space="space.200">
              {outages.map((outage) => (
                <Button
                  key={outage.id}
                  appearance="subtle"
                  onClick={() => handleOutageSelect(outage)}
                >
                  <Stack space="space.100">
                    <Inline space="space.100">
                      <Text>{outage.severity === 'Critical' ? '🔴' : '🟡'}</Text>
                      <Text>{outage.service}</Text>
                      <Lozenge appearance={
                        outage.severity === 'Critical' ? 'removed' : 'inprogress'
                      }>
                        {outage.severity}
                      </Lozenge>
                    </Inline>
                    <Text>{outage.region} - {outage.impactedCustomers} affected</Text>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </Stack>

        </Stack>
      </Box>
    );
  };

  const SearchPage = () => (
    <Box padding="space.400">
      <Stack space="space.300">
        <Heading>AI Search</Heading>
        <Text>Intelligent search functionality</Text>
      </Stack>
    </Box>
  );

  const MapPage = () => (
    <Box padding="space.400">
      <Stack space="space.300">
        <Heading>Network Status Map</Heading>
        <Text>Interactive map view</Text>
      </Stack>
    </Box>
  );

  const RecordsPage = () => (
    <Box padding="space.400">
      <Stack space="space.300">
        <Heading>Communication Records</Heading>
        <Text>Message history and templates</Text>
      </Stack>
    </Box>
  );

  return (
    <Box>
      <TopNavigation />
      
      {activeView === 'dashboard' && <LandingPage />}
      {activeView === 'search' && <SearchPage />}
      {activeView === 'map' && <MapPage />}
      {activeView === 'outages' && <OutagesPage />}
      {activeView === 'records' && <RecordsPage />}

      {isSearchModalOpen && (
        <Modal onClose={() => setIsSearchModalOpen(false)}>
          <Stack space="space.400">
            <Heading>AI Search</Heading>
            
            <TextField
              placeholder="Search outages..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
            
            <Stack space="space.200">
              <Text>Search Results</Text>
              {searchQuery ? (
                <Text>Searching for: "{searchQuery}"</Text>
              ) : (
                <Text>Enter search terms...</Text>
              )}
            </Stack>
            
            <Button appearance="primary" onClick={() => setIsSearchModalOpen(false)}>
              Close
            </Button>
          </Stack>
        </Modal>
      )}

      {isDetailsPanelOpen && selectedOutage && (
        <Modal onClose={() => setIsDetailsPanelOpen(false)}>
          <Stack space="space.400">
            <Stack space="space.200">
              <Heading>Outage Details</Heading>
              <Lozenge appearance={
                selectedOutage.severity === 'Critical' ? 'removed' : 'inprogress'
              }>
                {selectedOutage.severity}
              </Lozenge>
            </Stack>
            
            <Stack space="space.200">
              <Stack space="space.100">
                <Text>Service: {selectedOutage.service}</Text>
              </Stack>
              
              <Stack space="space.100">
                <Text>Description: {selectedOutage.description}</Text>
              </Stack>
              
              <Stack space="space.100">
                <Text>Location: {selectedOutage.region}</Text>
              </Stack>
              
              <Stack space="space.100">
                <Text>Customer Impact: {selectedOutage.impactedCustomers} customers affected</Text>
              </Stack>
              
              <Stack space="space.100">
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
