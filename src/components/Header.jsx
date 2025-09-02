import React, { useState } from 'react';
import { Search, Bell, Settings, Wallet, ChevronDown, LogOut, ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useWallet } from '../context/WalletContext';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function Header() {
  const { 
    isConnected, 
    shortenedAddress, 
    balance, 
    disconnectWallet,
    wallet,
    isLoading
  } = useWallet();
  
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const handleConnectClick = () => {
    setVisible(true);
  };
  
  const handleDisconnect = async () => {
    await disconnectWallet();
    setShowDropdown(false);
  };
  
  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };
  
  const openExplorer = () => {
    if (!isConnected) return;
    
    const explorerUrl = `https://explorer.solana.com/address/${shortenedAddress}`;
    window.open(explorerUrl, '_blank');
    setShowDropdown(false);
  };

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
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={toggleDropdown}
                disabled={isLoading}
              >
                <Wallet className="h-4 w-4 mr-1" />
                <span className="text-sm text-gray-300 hidden sm:inline">
                  {shortenedAddress}
                </span>
                <span className="text-sm font-medium text-green-400">
                  {balance.toFixed(2)} SOL
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-white/10 z-10">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-sm text-gray-400">Connected with {wallet}</p>
                    <p className="text-white font-medium">{shortenedAddress}</p>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded flex items-center"
                      onClick={openExplorer}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View on Explorer
                    </button>
                    
                    <button 
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/10 rounded flex items-center"
                      onClick={handleDisconnect}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Disconnect
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button 
              onClick={handleConnectClick} 
              size="sm"
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
