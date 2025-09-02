import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Input } from './Input'
import { Trophy, Clock, Users, DollarSign } from 'lucide-react'
import { useBets } from '../context/BetContext'
import { useWallet } from '../context/WalletContext'

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
]

export function BettingInterface() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedOption, setSelectedOption] = useState('')
  const [betAmount, setBetAmount] = useState('')
  const { placeBet } = useBets()
  const { isConnected } = useWallet()

  const handlePlaceBet = () => {
    if (!selectedEvent || !selectedOption || !betAmount) return
    
    placeBet({
      eventId: selectedEvent.id,
      outcome: selectedOption,
      stakeAmount: parseFloat(betAmount)
    })
    
    // Reset form
    setSelectedEvent(null)
    setSelectedOption('')
    setBetAmount('')
  }

  const formatTimeRemaining = (endTime) => {
    const end = new Date(endTime)
    const now = new Date()
    const diff = end - now
    
    if (diff <= 0) return 'Ended'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    return `${hours}h`
  }

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="lg:col-span-2 space-y-4">
          {mockEvents.map((event) => (
            <Card 
              key={event.id} 
              className={`cursor-pointer transition-all ${
                selectedEvent?.id === event.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedEvent(event)}
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
          ))}
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
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Bet Amount (SOL)</label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    step="0.1"
                    min="0.1"
                  />
                </div>
                
                {betAmount && selectedOption && (
                  <div className="p-3 bg-purple-600/10 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-gray-400">Potential Payout</p>
                    <p className="text-lg font-semibold text-white">
                      ~{(parseFloat(betAmount) * 1.8).toFixed(2)} SOL
                    </p>
                    <p className="text-xs text-gray-500">
                      (Includes 5% platform fee)
                    </p>
                  </div>
                )}
                
                <Button
                  onClick={handlePlaceBet}
                  disabled={!isConnected || !selectedOption || !betAmount}
                  className="w-full"
                >
                  {!isConnected ? 'Connect Wallet' : 'Place Bet'}
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
  )
}