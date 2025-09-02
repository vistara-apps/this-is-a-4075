import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { getWalletAdapterConfig, shortenAddress } from '../utils/wallet';
import { getSolBalance } from '../utils/solana';
import { SOLANA_NETWORK, RPC_ENDPOINTS } from '../config/constants';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

const WalletContext = createContext();

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function WalletProvider({ children }) {
  // Set up Solana network
  const network = SOLANA_NETWORK === 'mainnet-beta' 
    ? WalletAdapterNetwork.Mainnet 
    : WalletAdapterNetwork.Devnet;
  
  // Custom RPC endpoint or fallback to default
  const endpoint = useMemo(() => {
    return RPC_ENDPOINTS[SOLANA_NETWORK] || clusterApiUrl(network);
  }, [network]);
  
  // Get wallet adapter configuration
  const walletAdapterConfig = useMemo(() => getWalletAdapterConfig(), []);
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider {...walletAdapterConfig}>
        <WalletModalProvider>
          <WalletContextProvider>{children}</WalletContextProvider>
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

function WalletContextProvider({ children }) {
  const { 
    publicKey,
    connected,
    connecting,
    disconnecting,
    select,
    disconnect,
    wallet,
    wallets,
    connect
  } = useSolanaWallet();
  
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Format wallet address for display
  const walletAddress = useMemo(() => {
    if (!publicKey) return '';
    return publicKey.toString();
  }, [publicKey]);
  
  // Shortened wallet address for display
  const shortenedAddress = useMemo(() => {
    if (!walletAddress) return '';
    return shortenAddress(walletAddress);
  }, [walletAddress]);
  
  // Get wallet balance when connected
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !walletAddress) {
        setBalance(0);
        return;
      }
      
      try {
        setIsLoading(true);
        const solBalance = await getSolBalance(walletAddress);
        setBalance(solBalance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        setBalance(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBalance();
    
    // Set up interval to refresh balance
    const intervalId = setInterval(fetchBalance, 30000); // Every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [connected, walletAddress]);
  
  // Connect wallet handler
  const connectWallet = async (walletName) => {
    try {
      setIsLoading(true);
      
      if (walletName) {
        // Select specific wallet if provided
        const selectedWallet = wallets.find(w => 
          w.adapter.name.toLowerCase() === walletName.toLowerCase()
        );
        
        if (selectedWallet) {
          select(selectedWallet.adapter.name);
        }
      }
      
      // Connect to wallet
      await connect();
      
      console.log('Wallet connected successfully');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Disconnect wallet handler
  const disconnectWallet = async () => {
    try {
      setIsLoading(true);
      await disconnect();
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    isConnected: connected,
    isConnecting: connecting,
    isDisconnecting: disconnecting,
    isLoading,
    walletAddress,
    shortenedAddress,
    balance,
    connectWallet,
    disconnectWallet,
    wallet: wallet?.adapter?.name || null,
    availableWallets: wallets.map(w => w.adapter.name),
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}
