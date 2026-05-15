/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import Layout from './components/Layout';
import Dashboard from './components/screens/Dashboard';
import Inventory from './components/screens/Inventory';
import Sales from './components/screens/Sales';
import Marketing from './components/screens/Marketing';
import Settings from './components/screens/Settings';
import AgentBuilder from './components/screens/AgentBuilder';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = React.useState<View>('dashboard');

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
      case 'settings':
        return <Settings />;
      case 'agent-builder':
        return <AgentBuilder />;
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

