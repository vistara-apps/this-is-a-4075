/**
 * Supabase client and utilities
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config/constants';

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Get user profile by wallet address
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<Object|null>} User profile or null
 */
export async function getUserProfile(walletAddress) {
  if (!walletAddress) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Create or update user profile
 * @param {Object} profile - User profile data
 * @param {string} profile.walletAddress - Wallet address
 * @param {string} profile.username - Username (optional)
 * @param {string} profile.avatar - Avatar URL (optional)
 * @returns {Promise<Object|null>} Updated profile or null
 */
export async function upsertUserProfile(profile) {
  if (!profile.walletAddress) return null;
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        wallet_address: profile.walletAddress,
        username: profile.username,
        avatar_url: profile.avatar,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }
}

/**
 * Get events from Supabase
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of events to return
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.status - Event status filter
 * @returns {Promise<Array|null>} Events array or null
 */
export async function getEvents({ limit = 10, offset = 0, status = 'active' } = {}) {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching events:', error);
    return null;
  }
}

/**
 * Get event by ID
 * @param {number} eventId - Event ID
 * @returns {Promise<Object|null>} Event or null
 */
export async function getEventById(eventId) {
  if (!eventId) return null;
  
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

/**
 * Get bets by wallet address
 * @param {string} walletAddress - Wallet address
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of bets to return
 * @param {number} options.offset - Offset for pagination
 * @param {string} options.status - Bet status filter
 * @returns {Promise<Array|null>} Bets array or null
 */
export async function getBetsByWallet(walletAddress, { limit = 10, offset = 0, status = null } = {}) {
  if (!walletAddress) return null;
  
  try {
    let query = supabase
      .from('bets')
      .select('*, events(*)')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching bets:', error);
    return null;
  }
}

/**
 * Sync on-chain bet with Supabase
 * @param {Object} bet - Bet data
 * @returns {Promise<Object|null>} Synced bet or null
 */
export async function syncBet(bet) {
  if (!bet || !bet.id) return null;
  
  try {
    const { data, error } = await supabase
      .from('bets')
      .upsert({
        id: bet.id,
        event_id: bet.eventId,
        wallet_address: bet.walletAddress,
        outcome: bet.outcome,
        stake_amount: bet.stakeAmount,
        potential_payout: bet.potentialPayout,
        actual_payout: bet.actualPayout,
        status: bet.status,
        transaction_signature: bet.signature,
        created_at: bet.creationTimestamp,
        settled_at: bet.settlementTimestamp,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error syncing bet:', error);
    return null;
  }
}

