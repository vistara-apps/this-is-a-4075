/**
 * Custom hook for Supabase integration
 */
import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../context/WalletContext';
import { useToast } from './useToast';
import {
  getUserProfile,
  upsertUserProfile,
  getEvents,
  getEventById,
  getBetsByWallet,
  syncBet,
} from '../utils/supabase';

/**
 * Custom hook for Supabase integration
 * @returns {Object} Supabase methods and state
 */
export function useSupabase() {
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { isConnected, walletAddress } = useWallet();
  const toast = useToast();

  /**
   * Fetch user profile
   * @returns {Promise<Object|null>} User profile or null
   */
  const fetchUserProfile = useCallback(async () => {
    if (!isConnected || !walletAddress) return null;
    
    setIsLoading(true);
    
    try {
      const profile = await getUserProfile(walletAddress);
      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch user profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress, toast]);

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object|null>} Updated profile or null
   */
  const updateUserProfile = useCallback(async (profileData) => {
    if (!isConnected || !walletAddress) {
      toast.error('Please connect your wallet to update profile');
      return null;
    }
    
    setIsLoading(true);
    
    try {
      const updatedProfile = await upsertUserProfile({
        walletAddress,
        ...profileData,
      });
      
      setUserProfile(updatedProfile);
      toast.success('Profile updated successfully');
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress, toast]);

  /**
   * Fetch events
   * @param {Object} options - Query options
   * @returns {Promise<Array|null>} Events array or null
   */
  const fetchEvents = useCallback(async (options = {}) => {
    setIsLoading(true);
    
    try {
      const events = await getEvents(options);
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Fetch event by ID
   * @param {number} eventId - Event ID
   * @returns {Promise<Object|null>} Event or null
   */
  const fetchEventById = useCallback(async (eventId) => {
    if (!eventId) return null;
    
    setIsLoading(true);
    
    try {
      const event = await getEventById(eventId);
      return event;
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to fetch event');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  /**
   * Fetch user bets
   * @param {Object} options - Query options
   * @returns {Promise<Array|null>} Bets array or null
   */
  const fetchUserBets = useCallback(async (options = {}) => {
    if (!isConnected || !walletAddress) return [];
    
    setIsLoading(true);
    
    try {
      const bets = await getBetsByWallet(walletAddress, options);
      return bets;
    } catch (error) {
      console.error('Error fetching user bets:', error);
      toast.error('Failed to fetch your bets');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, walletAddress, toast]);

  /**
   * Sync bet with Supabase
   * @param {Object} betData - Bet data
   * @returns {Promise<Object|null>} Synced bet or null
   */
  const syncBetData = useCallback(async (betData) => {
    if (!isConnected || !walletAddress || !betData) return null;
    
    try {
      // Add wallet address to bet data
      const betWithWallet = {
        ...betData,
        walletAddress,
      };
      
      const syncedBet = await syncBet(betWithWallet);
      return syncedBet;
    } catch (error) {
      console.error('Error syncing bet:', error);
      // Don't show toast here as it's a background operation
      return null;
    }
  }, [isConnected, walletAddress]);

  // Fetch user profile when wallet connects
  useEffect(() => {
    if (isConnected && walletAddress) {
      fetchUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isConnected, walletAddress, fetchUserProfile]);

  return {
    isLoading,
    userProfile,
    fetchUserProfile,
    updateUserProfile,
    fetchEvents,
    fetchEventById,
    fetchUserBets,
    syncBetData,
  };
}

