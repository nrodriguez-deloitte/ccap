import React, { useState, useEffect } from 'react';
import ForgeReconciler, { Box, Text, Button, Stack, Heading, Inline, Form, Textfield, Image } from '@forge/react';
import TemplatesPage from './components/TemplatesPage.jsx';

const QuickActions = ({ selectedKey, onSelect }) => {
  const items = [
    { key: 'ai', label: 'AI Search' },
    { key: 'map', label: 'Map' },
    { key: 'outages', label: 'Outages' },
    { key: 'records', label: 'Records' },
    { key: 'templates', label: 'Templates123' },
    { key: 'create', label: 'Create comms' },
  ];

  const iconSrc = (key, active) => {
    // Tiny custom SVG icons as data URIs (circular chip with soft gradient)
    const base = (path) =>
      'data:image/svg+xml;utf8,' +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">\
           <defs>\
             <radialGradient id="bg" cx="50%" cy="40%" r="70%">\
               <stop offset="0%" stop-color="${active ? '#e0f2fe' : '#f0f9ff'}"/>\
               <stop offset="100%" stop-color="${active ? '#d1fae5' : '#ecfeff'}"/>\
             </radialGradient>\
             <filter id="d" x="-50%" y="-50%" width="200%" height="200%">\
               <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000" flood-opacity="0.15"/>\
             </filter>\
           </defs>\
           <circle cx="20" cy="20" r="18" fill="url(#bg)" filter="url(#d)"/>\
           ${path}\
         </svg>`
      );

    switch (key) {
      case 'ai':
        return base('<circle cx="18" cy="18" r="7" stroke="#2563eb" stroke-width="2" fill="none"/><line x1="24" y1="24" x2="31" y2="31" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>');
      case 'map':
        return base('<path d="M9 13l7-3 8 3 7-3v18l-7 3-8-3-7 3V13z" fill="#10b981" opacity="0.25"/><path d="M16 10v20M24 13v20" stroke="#10b981" stroke-width="2"/>');
      case 'outages':
        return base('<path d="M20 9l7 14h-5l3 8-7-14h5l-3-8z" fill="#f43f5e"/>');
      case 'records':
        return base('<rect x="12" y="9" width="16" height="22" rx="2" fill="#6366f1" opacity="0.25"/><path d="M14 15h12M14 19h12M14 23h7" stroke="#6366f1" stroke-width="2" stroke-linecap="round"/>');
      case 'templates':
        return base('<rect x="10" y="12" width="20" height="16" rx="3" fill="#f59e0b" opacity="0.25"/><path d="M14 16h12M14 20h8" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>');
      case 'create':
        return base('<circle cx="20" cy="20" r="10" fill="#22c55e" opacity="0.25"/><path d="M20 12v16M12 20h16" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/>');
      default:
        return base('<circle cx="16" cy="16" r="6" fill="#64748b"/>');
    }
  };

  return (
    <Inline space="space.300">
      {items.map((it) => (
        <Stack key={it.key}>
          <Button appearance="subtle" onClick={() => {
            if (it.key === 'templates') {
              console.log('[UI] Templates tab clicked');
            }
            onSelect(it.key);
          }}>
            <Image src={iconSrc(it.key, selectedKey === it.key)} alt={it.label} />
          </Button>
          <Text>{it.label}</Text>
        </Stack>
      ))}
    </Inline>
  );
};

const Landing = () => {
  const [lastQuery, setLastQuery] = useState('');
  const [lastAction, setLastAction] = useState('');

  useEffect(() => {
    if (lastAction) {
      console.log(`[UI] Tab switched: ${lastAction}`);
      if (lastAction === 'templates') {
        console.log('[UI] Templates tab selected (useEffect)');
      }
    }
  }, [lastAction]);

  // Lightweight decorative assets (SVG as data URIs for safe, colorful visuals)
  const heroGradient =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="140" viewBox="0 0 1200 140">\
        <defs>\
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">\
            <stop offset="0%" stop-color="#a1c4fd"/>\
            <stop offset="50%" stop-color="#c2e9fb"/>\
            <stop offset="100%" stop-color="#b9fbc0"/>\
          </linearGradient>\
        </defs>\
        <rect width="1200" height="140" fill="url(#g)"/>\
      </svg>'
    );

  const orbSvg =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">\
        <defs>\
          <radialGradient id="rg" cx="50%" cy="40%" r="60%">\
            <stop offset="0%" stop-color="#9ef0f0"/>\
            <stop offset="50%" stop-color="#6ee7b7"/>\
            <stop offset="100%" stop-color="#3b82f6"/>\
          </radialGradient>\
        </defs>\
        <circle cx="48" cy="48" r="44" fill="url(#rg)"/>\
      </svg>'
    );

  // Render tab content modularly
  let tabContent = null;
  switch (lastAction) {
    case 'templates':
      console.log('[UI] Rendering TemplatesPage');
      tabContent = <TemplatesPage />;
      break;
    case 'outages':
      tabContent = <Text>Outages list will appear here.</Text>;
      break;
    default:
      tabContent = null;
  }

  return (
    <Box>
      <Stack>
        {/* Soft gradient header for color */}
        <Box>
          <Image src={heroGradient} alt="decorative gradient" />
        </Box>

        {/* Top quick actions */}
        <Box>
          <QuickActions selectedKey={lastAction} onSelect={(key) => setLastAction(key)} />
        </Box>

        {/* Hero copy */}
        <Box>
          <Stack>
            <Image src={orbSvg} alt="decorative orb" />
            <Heading>Explore network outages</Heading>
            <Text>
              Use AI to find details on both open and resolved outages, along with
              associated communication notifications.
            </Text>
          </Stack>
        </Box>

        {/* Search bar approximation */}
        <Box>
          <Form onSubmit={(data) => setLastQuery(data.query || '')}>
            <Inline>
              <Textfield name="query" label="Search" placeholder="Ask anything about network outages" />
              <Button type="submit" appearance="primary">Search</Button>
            </Inline>
          </Form>
        </Box>

        {/* Tab content rendered here */}
        {tabContent && (
          <Box marginTop="large">{tabContent}</Box>
        )}
      </Stack>
    </Box>
  );
};

// Helper to render human-friendly headings for selected actions
const itemsLabel = (key) => {
  switch (key) {
    case 'ai':
      return 'AI Search';
    case 'map':
      return 'Map';
    case 'records':
      return 'Records';
    case 'templates':
      return 'Templates';
    case 'create':
      return 'Create comms';
    default:
      return '';
  }
};

ForgeReconciler.render(<Landing />);
