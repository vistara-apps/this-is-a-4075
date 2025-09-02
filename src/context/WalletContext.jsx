import React, { createContext, useContext, useState } from 'react'

const WalletContext = createContext()

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export function WalletProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const connectWallet = async () => {
    // Simulate wallet connection
    try {
      // In a real app, this would connect to Phantom/Solflare wallet
      const mockAddress = '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy'
      setWalletAddress(mockAddress.slice(0, 4) + '...' + mockAddress.slice(-4))
      setIsConnected(true)
      
      // Show success notification
      console.log('Wallet connected successfully')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress('')
    console.log('Wallet disconnected')
  }

  const value = {
    isConnected,
    walletAddress,
    connectWallet,
    disconnectWallet
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}