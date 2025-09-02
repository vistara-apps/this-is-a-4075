import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { BettingInterface } from './components/BettingInterface';
import { BetHistory } from './components/BetHistory';
import { Toast } from './components/Toast';
import { WalletProvider } from './context/WalletContext';
import { BetProvider } from './context/BetContext';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === 'betting' || hash === 'history' || hash === 'dashboard') {
        setActiveView(hash);
      }
    };

    // Set initial view based on hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update hash when view changes
  useEffect(() => {
    window.location.hash = `#/${activeView}`;
  }, [activeView]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'betting':
        return <BettingInterface />;
      case 'history':
        return <BetHistory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WalletProvider>
      <BetProvider>
        <div className="min-h-screen gradient-bg">
          <div className="flex">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />
            <div className="flex-1 flex flex-col">
              <Header />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">
                {renderView()}
              </main>
            </div>
          </div>
          <Toast />
        </div>
      </BetProvider>
    </WalletProvider>
  );
}

export default App;
