import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/screens/Dashboard';
import Inventory from './components/screens/Inventory';
import Sales from './components/screens/Sales';
import Marketing from './components/screens/Marketing';
import AgentBuilder from './components/screens/AgentBuilder';
import Settings from './components/screens/Settings';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'sales':
        return <Sales />;
      case 'marketing':
        return <Marketing />;
      case 'agent-builder':
        return <AgentBuilder />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

// Made with Bob
