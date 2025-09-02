import React from 'react';
import ForgeReconciler, { 
  Text,
  Heading
} from '@forge/react';

// Minimal test to identify the problematic component
const TestApp = () => {
  return (
    <>
      <Heading size="large">CAP - Communications Assurance Platform</Heading>
      <Text>Testing basic components first...</Text>
    </>
  );
};

ForgeReconciler.render(<TestApp />);
