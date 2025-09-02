import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useWallet } from './WalletContext';
import { useBetTransaction } from '../hooks/useBetTransaction';
import { useSupabase } from '../hooks/useSupabase';
import { useToast } from '../hooks/useToast';

const BetContext = createContext();

export function useBets() {
  const context = useContext(BetContext);
  if (!context) {
    throw new Error('useBets must be used within a BetProvider');
  }
  return context;
}

// Mock events for demonstration
const mockEvents = [
  {
    id: 1,
    title: 'NBA Finals Game 7',
    description: 'Lakers vs Celtics - Who will win?',
    options: ['Lakers', 'Celtics'],
    totalPool: 150.5,
    participants: 234,
    endTime: '2024-01-20T20:00:00Z',
    status: 'active'
  },
  {
    id: 2,
    title: 'Champions League Final',
    description: 'Manchester City vs Real Madrid',
    options: ['Manchester City', 'Real Madrid', 'Draw'],
    totalPool: 89.2,
    participants: 156,
    endTime: '2024-01-25T19:00:00Z',
    status: 'active'
  },
  {
    id: 3,
    title: 'Cryptocurrency Price Prediction',
    description: 'Will SOL reach $200 by end of month?',
    options: ['Yes', 'No'],
    totalPool: 45.8,
    participants: 89,
    endTime: '2024-01-31T23:59:59Z',
    status: 'active'
  }
];

// Initial mock bets for demonstration
const initialMockBets = [
  {
    id: 1,
    eventId: 1,
    eventTitle: 'NBA Finals Game 7',
    eventDescription: 'Lakers vs Celtics - Who will win?',
    outcome: 'Lakers',
    stakeAmount: 2.5,
    potentialPayout: 4.75,
    actualPayout: 4.75,
    status: 'won',
    creationTimestamp: '2024-01-15T10:30:00Z',
    settlementTimestamp: '2024-01-15T22:00:00Z',
    signature: 'mock_tx_1'
  },
  {
    id: 2,
    eventId: 2,
    eventTitle: 'Champions League Final',
    eventDescription: 'Manchester City vs Real Madrid',
    outcome: 'Manchester City',
    stakeAmount: 1.0,
    potentialPayout: 1.9,
    actualPayout: null,
    status: 'pending',
    creationTimestamp: '2024-01-16T14:20:00Z',
    settlementTimestamp: null,
    signature: 'mock_tx_2'
  },
  {
    id: 3,
    eventId: 3,
    eventTitle: 'World Cup Semi-Final',
    eventDescription: 'Argentina vs Brazil',
    outcome: 'Argentina',
    stakeAmount: 3.0,
    potentialPayout: 5.7,
    actualPayout: 0,
    status: 'lost',
    creationTimestamp: '2024-01-10T16:45:00Z',
    settlementTimestamp: '2024-01-11T18:00:00Z',
    signature: 'mock_tx_3'
  }
];

export function BetProvider({ children }) {
  const [bets, setBets] = useState(initialMockBets);
  const [events, setEvents] = useState(mockEvents);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected, walletAddress } = useWallet();
  const { placeBet: executeBetTransaction, settleBet: executeSettlementTransaction, calculatePotentialPayout } = useBetTransaction();
  const { fetchUserBets, syncBetData, fetchEvents } = useSupabase();
  const toast = useToast();

  /**
   * Place a bet
   * @param {Object} betData - Bet data
   * @returns {Promise<Object|null>} Placed bet or null
   */
  const placeBet = useCallback(async (betData) => {
    if (!isConnected) {
      toast.error('Please connect your wallet to place a bet');
      return null;
    }

    setIsLoading(true);

    try {
      // Execute bet transaction
      const result = await executeBetTransaction(betData);
      
      if (!result) {
        throw new Error('Failed to place bet');
      }
      
      // Get event details
      const event = events.find(e => e.id === betData.eventId);
      
      // Create bet object
      const newBet = {
        ...result,
        eventTitle: event?.title || 'Unknown Event',
        eventDescription: event?.description || 'Event description',
      };
      
      // Update local state
      setBets(prev => [newBet, ...prev]);
      
      // Sync with Supabase
      await syncBetData(newBet);
      
      return newBet;
    } catch (error) {
      console.error('Error placing bet:', error);
      toast.error(`Failed to place bet: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, executeBetTransaction, events, syncBetData, toast]);

  /**
   * Settle a bet
   * @param {string} betId - Bet ID
   * @returns {Promise<Object|null>} Settled bet or null
   */
  const settleBet = useCallback(async (betId) => {
    if (!isConnected) {
      toast.error('Please connect your wallet to settle a bet');
      return null;
    }

    setIsLoading(true);

    try {
      // Find bet
      const bet = bets.find(b => b.id === betId);
      
      if (!bet) {
        throw new Error('Bet not found');
      }
      
      // Execute settlement transaction
      const result = await executeSettlementTransaction(betId);
      
      if (!result) {
        throw new Error('Failed to settle bet');
      }
      
      // Update bet status
      const updatedBet = {
        ...bet,
        status: 'won', // For demonstration, in reality this would come from the transaction result
        actualPayout: parseFloat(bet.potentialPayout),
        settlementTimestamp: result.settlementTimestamp,
        signature: result.signature,
      };
      
      // Update local state
      setBets(prev => prev.map(b => b.id === betId ? updatedBet : b));
      
      // Sync with Supabase
      await syncBetData(updatedBet);
      
      return updatedBet;
    } catch (error) {
      console.error('Error settling bet:', error);
      toast.error(`Failed to settle bet: ${error.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, bets, executeSettlementTransaction, syncBetData, toast]);

  /**
   * Get event by ID
   * @param {number} eventId - Event ID
   * @returns {Object|null} Event or null
   */
  const getEvent = useCallback((eventId) => {
    return events.find(event => event.id === eventId) || null;
  }, [events]);

  /**
   * Get all events
   * @param {Object} options - Filter options
   * @param {string} options.status - Event status filter
   * @returns {Array} Filtered events
   */
  const getEvents = useCallback((options = {}) => {
    let filteredEvents = [...events];
    
    if (options.status) {
      filteredEvents = filteredEvents.filter(event => event.status === options.status);
    }
    
    return filteredEvents;
  }, [events]);

  /**
   * Calculate user statistics
   */
  const userStats = {
    totalStaked: bets.reduce((sum, bet) => sum + bet.stakeAmount, 0).toFixed(2),
    totalWinnings: bets
      .filter(bet => bet.status === 'won')
      .reduce((sum, bet) => sum + (bet.actualPayout || 0), 0)
      .toFixed(2),
    activeBets: bets.filter(bet => bet.status === 'pending').length,
    winRate: bets.length > 0 
      ? ((bets.filter(bet => bet.status === 'won').length / bets.filter(bet => bet.status !== 'pending').length) * 100).toFixed(1)
      : 0
  };

  // Load user bets when wallet connects
  useEffect(() => {
    const loadUserBets = async () => {
      if (isConnected && walletAddress) {
        setIsLoading(true);
        
        try {
          const userBets = await fetchUserBets();
          
          if (userBets && userBets.length > 0) {
            // Format bets from Supabase to match our format
            const formattedBets = userBets.map(bet => ({
              id: bet.id,
              eventId: bet.event_id,
              eventTitle: bet.events?.title || 'Unknown Event',
              eventDescription: bet.events?.description || 'Event description',
              outcome: bet.outcome,
              stakeAmount: bet.stake_amount,
              potentialPayout: bet.potential_payout,
              actualPayout: bet.actual_payout,
              status: bet.status,
              creationTimestamp: bet.created_at,
              settlementTimestamp: bet.settled_at,
              signature: bet.transaction_signature,
            }));
            
            // Merge with mock bets for demonstration
            // In a real app, we would just use the fetched bets
            setBets(prev => {
              const existingIds = new Set(formattedBets.map(bet => bet.id));
              const remainingMocks = prev.filter(bet => !existingIds.has(bet.id));
              return [...formattedBets, ...remainingMocks];
            });
          }
        } catch (error) {
          console.error('Error loading user bets:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadUserBets();
  }, [isConnected, walletAddress, fetchUserBets]);

  // Load events
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      
      try {
        const fetchedEvents = await fetchEvents();
        
        if (fetchedEvents && fetchedEvents.length > 0) {
          // Format events from Supabase to match our format
          const formattedEvents = fetchedEvents.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            options: event.options,
            totalPool: event.total_pool,
            participants: event.participants,
            endTime: event.end_time,
            status: event.status,
          }));
          
          // Merge with mock events for demonstration
          // In a real app, we would just use the fetched events
          setEvents(prev => {
            const existingIds = new Set(formattedEvents.map(event => event.id));
            const remainingMocks = prev.filter(event => !existingIds.has(event.id));
            return [...formattedEvents, ...remainingMocks];
          });
        }
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEvents();
  }, [fetchEvents]);

  const value = {
    bets,
    events,
    isLoading,
    placeBet,
    settleBet,
    getEvent,
    getEvents,
    userStats,
    calculatePotentialPayout,
  };

  return (
    <BetContext.Provider value={value}>
      {children}
    </BetContext.Provider>
  );
}
