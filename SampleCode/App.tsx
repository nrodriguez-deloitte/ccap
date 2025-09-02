import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ActivityLog } from './components/ActivityLog';
import { ApprovalQueue } from './components/ApprovalQueue';
import { Archive } from './components/Archive';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'activity-log':
        return <ActivityLog />;
      case 'approvals':
        return <ApprovalQueue />;
      case 'archive':
        return <Archive />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}