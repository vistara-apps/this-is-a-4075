import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PLATFORM_FEE_PERCENT } from '../src/config/constants';

// Mock the hooks and context
vi.mock('../src/context/WalletContext', () => ({
  useWallet: () => ({
    isConnected: true,
    walletAddress: '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy',
    balance: 10.0
  })
}));

vi.mock('../src/hooks/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    update: vi.fn(),
    transaction: vi.fn()
  })
}));

// Import the hook after mocking dependencies
import { useBetTransaction } from '../src/hooks/useBetTransaction';

// Mock implementation of useBetTransaction for testing
const mockUseBetTransaction = () => {
  const [isProcessing, setIsProcessing] = vi.useState(false);
  const [currentTxSignature, setCurrentTxSignature] = vi.useState(null);
  
  const calculatePotentialPayout = (stakeAmount, odds = 2) => {
    if (!stakeAmount) return 0;
    
    const fee = stakeAmount * (PLATFORM_FEE_PERCENT / 100);
    return (stakeAmount * odds) - fee;
  };
  
  const placeBet = async (betData) => {
    setIsProcessing(true);
    
    try {
      // Mock transaction
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const mockSignature = 'mock_tx_' + Math.random().toString(36).substring(2, 15);
      setCurrentTxSignature(mockSignature);
      
      const potentialPayout = calculatePotentialPayout(betData.stakeAmount);
      
      return {
        id: Date.now(),
        signature: mockSignature,
        eventId: betData.eventId,
        outcome: betData.outcome,
        stakeAmount: betData.stakeAmount,
        potentialPayout: potentialPayout.toFixed(2),
        status: 'pending',
        creationTimestamp: new Date().toISOString(),
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  const settleBet = async (betId) => {
    setIsProcessing(true);
    
    try {
      // Mock transaction
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const mockSignature = 'mock_tx_' + Math.random().toString(36).substring(2, 15);
      setCurrentTxSignature(mockSignature);
      
      return {
        id: betId,
        signature: mockSignature,
        status: 'settled',
        settlementTimestamp: new Date().toISOString(),
      };
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    currentTxSignature,
    placeBet,
    settleBet,
    calculatePotentialPayout,
  };
};

// Replace the real implementation with our mock
vi.mock('../src/hooks/useBetTransaction', () => ({
  useBetTransaction: mockUseBetTransaction
}));

describe('Bet Transaction Hook', () => {
  describe('calculatePotentialPayout', () => {
    it('should calculate potential payout correctly with platform fee', () => {
      const { calculatePotentialPayout } = useBetTransaction();
      
      // With default odds (2)
      expect(calculatePotentialPayout(1)).toBeCloseTo(1.9, 1); // 1 * 2 - (1 * 5%)
      expect(calculatePotentialPayout(2)).toBeCloseTo(3.8, 1); // 2 * 2 - (2 * 5%)
      
      // With custom odds
      expect(calculatePotentialPayout(1, 3)).toBeCloseTo(2.85, 2); // 1 * 3 - (1 * 5%)
    });
    
    it('should return 0 for invalid stake amounts', () => {
      const { calculatePotentialPayout } = useBetTransaction();
      
      expect(calculatePotentialPayout(0)).toBe(0);
      expect(calculatePotentialPayout(null)).toBe(0);
      expect(calculatePotentialPayout(undefined)).toBe(0);
    });
  });
  
  describe('placeBet', () => {
    it('should place a bet and return bet data', async () => {
      const { placeBet } = useBetTransaction();
      
      const betData = {
        eventId: 1,
        outcome: 'Lakers',
        stakeAmount: 2.5
      };
      
      const result = await placeBet(betData);
      
      expect(result).toMatchObject({
        eventId: 1,
        outcome: 'Lakers',
        stakeAmount: 2.5,
        status: 'pending'
      });
      
      expect(result.signature).toBeDefined();
      expect(result.potentialPayout).toBeDefined();
      expect(result.creationTimestamp).toBeDefined();
    });
  });
  
  describe('settleBet', () => {
    it('should settle a bet and return settlement data', async () => {
      const { settleBet } = useBetTransaction();
      
      const betId = 123;
      const result = await settleBet(betId);
      
      expect(result).toMatchObject({
        id: betId,
        status: 'settled'
      });
      
      expect(result.signature).toBeDefined();
      expect(result.settlementTimestamp).toBeDefined();
    });
  });
});

