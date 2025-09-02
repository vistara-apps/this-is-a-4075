import React from 'react'
import { Search, Bell, Settings } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { useWallet } from '../context/WalletContext'

export function Header() {
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet()

  return (
    <header className="border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <h1 className="text-xl font-semibold text-white">Solana BetHub</h1>
          <div className="hidden sm:block max-w-md flex-1">
            <Input 
              placeholder="Search events..." 
              icon={Search}
              className="bg-white/5"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="p-2">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Settings className="h-5 w-5" />
          </Button>
          
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-300 hidden sm:inline">
                {walletAddress}
              </span>
              <Button variant="outline" size="sm" onClick={disconnectWallet}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button onClick={connectWallet} size="sm">
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}