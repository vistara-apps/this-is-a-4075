import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { isValidSolanaAddress, shortenAddress, solToLamports, lamportsToSol } from '../src/utils/solana';
import { formatWalletName, getWalletIcon } from '../src/utils/wallet';

describe('Solana Utilities', () => {
  describe('isValidSolanaAddress', () => {
    it('should return true for valid Solana addresses', () => {
      const validAddresses = [
        '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy',
        'So11111111111111111111111111111111111111112',
        'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'
      ];
      
      validAddresses.forEach(address => {
        expect(isValidSolanaAddress(address)).toBe(true);
      });
    });
    
    it('should return false for invalid Solana addresses', () => {
      const invalidAddresses = [
        '',
        'not-an-address',
        '0x1234567890123456789012345678901234567890', // Ethereum address
        '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBT', // Too short
        '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTyy' // Too long
      ];
      
      invalidAddresses.forEach(address => {
        expect(isValidSolanaAddress(address)).toBe(false);
      });
    });
  });
  
  describe('shortenAddress', () => {
    it('should shorten addresses correctly with default chars', () => {
      const address = '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy';
      const shortened = shortenAddress(address);
      
      expect(shortened).toBe('4vMs...gBTy');
    });
    
    it('should shorten addresses with custom chars', () => {
      const address = '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy';
      const shortened = shortenAddress(address, 6);
      
      expect(shortened).toBe('4vMsoU...z4xgBTy');
    });
    
    it('should handle empty addresses', () => {
      expect(shortenAddress('')).toBe('');
      expect(shortenAddress(null)).toBe('');
      expect(shortenAddress(undefined)).toBe('');
    });
  });
  
  describe('solToLamports and lamportsToSol', () => {
    it('should convert SOL to lamports correctly', () => {
      expect(solToLamports(1)).toBe(1000000000);
      expect(solToLamports(0.5)).toBe(500000000);
      expect(solToLamports(0.000000001)).toBe(1);
      expect(solToLamports(0)).toBe(0);
    });
    
    it('should convert lamports to SOL correctly', () => {
      expect(lamportsToSol(1000000000)).toBe(1);
      expect(lamportsToSol(500000000)).toBe(0.5);
      expect(lamportsToSol(1)).toBe(0.000000001);
      expect(lamportsToSol(0)).toBe(0);
    });
    
    it('should be reversible', () => {
      const solAmount = 2.5;
      const lamports = solToLamports(solAmount);
      const solAgain = lamportsToSol(lamports);
      
      expect(solAgain).toBe(solAmount);
    });
  });
});

describe('Wallet Utilities', () => {
  describe('formatWalletName', () => {
    it('should format wallet names correctly', () => {
      expect(formatWalletName('Phantom Wallet')).toBe('Phantom');
      expect(formatWalletName('Solflare')).toBe('Solflare');
      expect(formatWalletName('Other Wallet')).toBe('Other Wallet');
    });
    
    it('should handle empty wallet names', () => {
      expect(formatWalletName('')).toBe('');
      expect(formatWalletName(null)).toBe('');
      expect(formatWalletName(undefined)).toBe('');
    });
  });
  
  describe('getWalletIcon', () => {
    it('should return correct icons for known wallets', () => {
      expect(getWalletIcon('Phantom')).toContain('phantom.app');
      expect(getWalletIcon('Solflare')).toContain('solflare.com');
    });
    
    it('should return null for unknown wallets', () => {
      expect(getWalletIcon('Unknown Wallet')).toBeNull();
    });
  });
});

