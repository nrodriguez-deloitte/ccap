import React, { useState } from 'react';
import { Box, Table, Head, Row, Cell, Button, Badge, Text, Spinner } from '@forge/react';

const sampleTemplates = [
  {
    id: 'TPL-001',
    name: 'B2B Customer Notification',
    type: 'Email',
    lastUpdated: '2025-08-19 14:32',
    status: 'Published',
    editRequest: null,
    version: 'v3.2',
  },
  {
    id: 'TPL-002',
    name: 'Crisis Outage Alert',
    type: 'Confluence Page',
    lastUpdated: '2025-08-18 09:15',
    status: 'Published',
    editRequest: 'REQ-1045',
    version: 'v2.7',
  },
  {
    id: 'TPL-003',
    name: 'General Notification',
    type: 'Email',
    lastUpdated: '2025-08-17 11:00',
    status: 'Published',
    editRequest: null,
    version: 'v1.9',
  },
];

export default function TemplatesPage() {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState(sampleTemplates);

  return (
    <Box padding="large">
      <Text size="xlarge" weight="bold">Templates Management</Text>
      <Text>Manage notification and outage templates. Submit edit requests for approval.</Text>
      <Box marginTop="large">
        {loading ? <Spinner /> : (
          <Table>
            <Head>
              <Row>
                <Cell>Template Name</Cell>
                <Cell>Type</Cell>
                <Cell>Last Updated</Cell>
                <Cell>Status</Cell>
                <Cell>Edit Request</Cell>
                <Cell>Version</Cell>
                <Cell>Actions</Cell>
              </Row>
            </Head>
            {templates.map(tpl => (
              <Row key={tpl.id}>
                <Cell>{tpl.name}</Cell>
                <Cell>{tpl.type}</Cell>
                <Cell>{tpl.lastUpdated}</Cell>
                <Cell>
                  <Badge appearance={tpl.status === 'Published' ? 'success' : 'default'}>
                    {tpl.status}
                  </Badge>
                </Cell>
                <Cell>
                  {tpl.editRequest
                    ? <Badge appearance="removed">Edit Pending ({tpl.editRequest})</Badge>
                    : <Text muted>—</Text>
                  }
                </Cell>
                <Cell>{tpl.version}</Cell>
                <Cell>
                  <Button appearance="primary" disabled={!!tpl.editRequest}>
                    {tpl.editRequest ? 'Edit Locked' : 'Request Edit'}
                  </Button>
                </Cell>
              </Row>
            ))}
          </Table>
        )}
      </Box>
    </Box>
  );
}
