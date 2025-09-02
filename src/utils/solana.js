/**
 * Solana blockchain utilities
 */
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { RPC_ENDPOINTS, SOLANA_NETWORK } from '../config/constants';

/**
 * Create a Solana connection
 * @returns {Connection} Solana connection object
 */
export const createConnection = () => {
  const endpoint = RPC_ENDPOINTS[SOLANA_NETWORK] || clusterApiUrl(SOLANA_NETWORK);
  return new Connection(endpoint, 'confirmed');
};

/**
 * Convert SOL to lamports
 * @param {number} sol - Amount in SOL
 * @returns {number} Amount in lamports
 */
export const solToLamports = (sol) => {
  return Math.round(sol * LAMPORTS_PER_SOL);
};

/**
 * Convert lamports to SOL
 * @param {number} lamports - Amount in lamports
 * @returns {number} Amount in SOL
 */
export const lamportsToSol = (lamports) => {
  return lamports / LAMPORTS_PER_SOL;
};

/**
 * Get SOL balance for a wallet
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<number>} Balance in SOL
 */
export const getSolBalance = async (walletAddress) => {
  try {
    const connection = createConnection();
    const publicKey = new PublicKey(walletAddress);
    const balance = await connection.getBalance(publicKey);
    return lamportsToSol(balance);
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    throw error;
  }
};

/**
 * Validate a Solana address
 * @param {string} address - Address to validate
 * @returns {boolean} Whether the address is valid
 */
export const isValidSolanaAddress = (address) => {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Shorten a Solana address for display
 * @param {string} address - Full address
 * @param {number} chars - Number of characters to show at start and end
 * @returns {string} Shortened address
 */
export const shortenAddress = (address, chars = 4) => {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Get transaction URL for explorer
 * @param {string} signature - Transaction signature
 * @returns {string} Explorer URL
 */
export const getExplorerUrl = (signature) => {
  const baseUrl = SOLANA_NETWORK === 'mainnet-beta' 
    ? 'https://explorer.solana.com' 
    : `https://explorer.solana.com/?cluster=${SOLANA_NETWORK}`;
  
  return `${baseUrl}/tx/${signature}`;
};

