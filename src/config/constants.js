/**
 * Application constants for Solana BetHub
 */

// Network configuration
export const SOLANA_NETWORK = process.env.NODE_ENV === 'production' 
  ? 'mainnet-beta' 
  : 'devnet';

export const RPC_ENDPOINTS = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  'devnet': 'https://api.devnet.solana.com',
  'testnet': 'https://api.testnet.solana.com',
};

// Platform configuration
export const PLATFORM_FEE_PERCENT = 5; // 5% platform fee
export const MIN_BET_AMOUNT = 0.1; // Minimum bet amount in SOL
export const MAX_BET_AMOUNT = 100; // Maximum bet amount in SOL

// Wallet configuration
export const WALLET_AUTOCONNECT = true;
export const WALLET_DISCONNECT_ON_CHANGE = true;

// Supabase configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Program IDs
export const PROGRAM_IDS = {
  BET_PROGRAM: process.env.NODE_ENV === 'production'
    ? 'BET1111111111111111111111111111111111111111'  // Replace with actual program ID
    : 'BET2222222222222222222222222222222222222222', // Replace with actual program ID
};

// Local storage keys
export const STORAGE_KEYS = {
  WALLET_PROVIDER: 'solana-bethub-wallet-provider',
  THEME: 'solana-bethub-theme',
};

// Toast notification durations
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
};

