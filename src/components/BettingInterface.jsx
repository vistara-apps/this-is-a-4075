import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Trophy, Clock, Users, DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { useBets } from '../context/BetContext';
import { useWallet } from '../context/WalletContext';
import { TransactionStatus } from './TransactionStatus';
import { useBetTransaction } from '../hooks/useBetTransaction';
import { useToast } from '../hooks/useToast';
import { MIN_BET_AMOUNT, MAX_BET_AMOUNT, PLATFORM_FEE_PERCENT } from '../config/constants';

export function BettingInterface() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [txStatus, setTxStatus] = useState(null);
  const { events, isLoading: isBetsLoading, placeBet } = useBets();
  const { isConnected, balance } = useWallet();
  const { isProcessing, currentTxSignature, calculatePotentialPayout } = useBetTransaction();
  const toast = useToast();

  // Calculate potential payout
  const potentialPayout = betAmount ? calculatePotentialPayout(parseFloat(betAmount)) : 0;

  // Handle placing a bet
  const handlePlaceBet = async () => {
    if (!selectedEvent || !selectedOption || !betAmount) return;
    
    // Validate bet amount
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount < MIN_BET_AMOUNT) {
      toast.error(`Minimum bet amount is ${MIN_BET_AMOUNT} SOL`);
      return;
    }
    
    if (amount > MAX_BET_AMOUNT) {
      toast.error(`Maximum bet amount is ${MAX_BET_AMOUNT} SOL`);
      return;
    }
    
    if (amount > balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    // Set transaction status to pending
    setTxStatus({
      status: 'pending',
      message: 'Processing your bet...',
    });
    
    try {
      // Place bet
      const result = await placeBet({
        eventId: selectedEvent.id,
        outcome: selectedOption,
        stakeAmount: amount
      });
      
      if (result) {
        // Update transaction status
        setTxStatus({
          status: 'success',
          signature: result.signature,
          message: 'Bet placed successfully!',
        });
        
        // Reset form after a delay
        setTimeout(() => {
          setSelectedEvent(null);
          setSelectedOption('');
          setBetAmount('');
          setTxStatus(null);
        }, 5000);
      } else {
        throw new Error('Failed to place bet');
      }
    } catch (error) {
      console.error('Error placing bet:', error);
      
      // Update transaction status
      setTxStatus({
        status: 'error',
        message: 'Failed to place bet',
        error: error.message,
      });
    }
  };

  // Format time remaining
  const formatTimeRemaining = (endTime) => {
    const end = new Date(endTime);
    const now = new Date();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  // Reset transaction status when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setTxStatus(null);
    }
  }, [isConnected]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Active Betting Events</h2>
        {!isConnected && (
          <div className="text-sm text-yellow-400 bg-yellow-600/20 px-3 py-2 rounded-lg">
            Connect your wallet to place bets
          </div>
        )}
      </div>

      {/* Transaction Status */}
      {txStatus && (
        <TransactionStatus
          status={txStatus.status}
          signature={txStatus.signature}
          message={txStatus.message}
          error={txStatus.error}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          {isBetsLoading ? (
            <Card className="p-8 text-center">
              <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading events...</p>
            </Card>
          ) : events.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="h-8 w-8 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No active events found</p>
            </Card>
          ) : (
            events.filter(event => event.status === 'active').map((event) => (
              <Card 
                key={event.id} 
                className={`cursor-pointer transition-all ${
                  selectedEvent?.id === event.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => {
                  setSelectedEvent(event);
                  setSelectedOption('');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.options.map((option) => (
                        <span 
                          key={option}
                          className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Trophy className="h-6 w-6 text-purple-400 ml-4" />
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-400" />
                    <div>
                      <p className="text-gray-400">Total Pool</p>
                      <p className="text-white font-medium">{event.totalPool} SOL</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-gray-400">Participants</p>
                      <p className="text-white font-medium">{event.participants}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-400" />
                    <div>
                      <p className="text-gray-400">Time Left</p>
                      <p className="text-white font-medium">{formatTimeRemaining(event.endTime)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Betting Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Place Your Bet</h3>
            
            {selectedEvent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Selected Event</label>
                  <p className="text-white font-medium">{selectedEvent.title}</p>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Choose Outcome</label>
                  <div className="space-y-2">
                    {selectedEvent.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => setSelectedOption(option)}
                        className={`w-full p-3 rounded-lg border transition-all ${
                          selectedOption === option
                            ? 'border-purple-500 bg-purple-600/20 text-white'
                            : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}
                        disabled={isProcessing}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Bet Amount (SOL) 
                    <span className="text-xs ml-1">
                      (Min: {MIN_BET_AMOUNT}, Max: {MAX_BET_AMOUNT})
                    </span>
                  </label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    step="0.1"
                    min={MIN_BET_AMOUNT}
                    max={MAX_BET_AMOUNT}
                    disabled={isProcessing}
                  />
                  
                  {isConnected && (
                    <p className="text-xs text-gray-400 mt-1">
                      Balance: {balance.toFixed(2)} SOL
                    </p>
                  )}
                </div>
                
                {betAmount && selectedOption && (
                  <div className="p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-gray-400">Potential Payout</p>
                    <p className="text-lg font-semibold text-white">
                      ~{potentialPayout.toFixed(2)} SOL
                    </p>
                    <p className="text-xs text-gray-500">
                      (Includes {PLATFORM_FEE_PERCENT}% platform fee)
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={handlePlaceBet}
                  disabled={!isConnected || !selectedOption || !betAmount || isProcessing || txStatus?.status === 'pending'}
                  className="w-full"
                >
                  {isProcessing || txStatus?.status === 'pending' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : !isConnected ? (
                    'Connect Wallet'
                  ) : (
                    'Place Bet'
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">Select an event to place a bet</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
