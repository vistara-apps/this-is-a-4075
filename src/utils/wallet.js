/**
 * Wallet utilities for Solana BetHub
 */
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WALLET_AUTOCONNECT, WALLET_DISCONNECT_ON_CHANGE } from '../config/constants';

/**
 * Get supported wallet adapters
 * @returns {Array} Array of wallet adapters
 */
export const getSupportedWalletAdapters = () => {
  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    new CoinbaseWalletAdapter(),
    new TorusWalletAdapter(),
  ];
};

/**
 * Get wallet adapter configuration
 * @returns {Object} Wallet adapter configuration
 */
export const getWalletAdapterConfig = () => {
  return {
    wallets: getSupportedWalletAdapters(),
    autoConnect: WALLET_AUTOCONNECT,
    disconnectOnChange: WALLET_DISCONNECT_ON_CHANGE,
  };
};

/**
 * Get wallet icon by name
 * @param {string} walletName - Wallet name
 * @returns {string} Icon URL or null
 */
export const getWalletIcon = (walletName) => {
  const walletIcons = {
    'Phantom': 'https://phantom.app/favicon.ico',
    'Solflare': 'https://solflare.com/favicon.ico',
    'Coinbase Wallet': 'https://www.coinbase.com/favicon.ico',
    'Torus': 'https://tor.us/favicon.ico',
  };
  
  return walletIcons[walletName] || null;
};

/**
 * Format wallet name for display
 * @param {string} walletName - Raw wallet name
 * @returns {string} Formatted wallet name
 */
export const formatWalletName = (walletName) => {
  if (!walletName) return '';
  
  // Handle special cases
  if (walletName.toLowerCase().includes('phantom')) return 'Phantom';
  if (walletName.toLowerCase().includes('solflare')) return 'Solflare';
  
  return walletName;
};
