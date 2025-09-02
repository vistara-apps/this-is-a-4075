import React, { useState } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'
import { BettingInterface } from './components/BettingInterface'
import { BetHistory } from './components/BetHistory'
import { WalletProvider } from './context/WalletContext'
import { BetProvider } from './context/BetContext'

function App() {
  const [activeView, setActiveView] = useState('dashboard')

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'betting':
        return <BettingInterface />
      case 'history':
        return <BetHistory />
      default:
        return <Dashboard />
    }
  }

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
        </div>
      </BetProvider>
    </WalletProvider>
  )
}

export default App