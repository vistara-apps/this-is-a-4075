import React, { createContext, useContext, useState } from 'react'

const BetContext = createContext()

export function useBets() {
  const context = useContext(BetContext)
  if (!context) {
    throw new Error('useBets must be used within a BetProvider')
  }
  return context
}

// Mock data for demonstration
const mockBets = [
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
    settlementTimestamp: '2024-01-15T22:00:00Z'
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
    settlementTimestamp: null
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
    settlementTimestamp: '2024-01-11T18:00:00Z'
  }
]

export function BetProvider({ children }) {
  const [bets, setBets] = useState(mockBets)

  const placeBet = (betData) => {
    const newBet = {
      id: Date.now(),
      ...betData,
      eventTitle: getEventTitle(betData.eventId),
      eventDescription: getEventDescription(betData.eventId),
      potentialPayout: (betData.stakeAmount * 1.9).toFixed(2),
      actualPayout: null,
      status: 'pending',
      creationTimestamp: new Date().toISOString(),
      settlementTimestamp: null
    }
    
    setBets(prev => [newBet, ...prev])
    console.log('Bet placed:', newBet)
  }

  const getEventTitle = (eventId) => {
    const events = {
      1: 'NBA Finals Game 7',
      2: 'Champions League Final',
      3: 'Cryptocurrency Price Prediction'
    }
    return events[eventId] || 'Unknown Event'
  }

  const getEventDescription = (eventId) => {
    const descriptions = {
      1: 'Lakers vs Celtics - Who will win?',
      2: 'Manchester City vs Real Madrid',
      3: 'Will SOL reach $200 by end of month?'
    }
    return descriptions[eventId] || 'Event description'
  }

  // Calculate user statistics
  const userStats = {
    totalStaked: bets.reduce((sum, bet) => sum + bet.stakeAmount, 0).toFixed(2),
    totalWinnings: bets
      .filter(bet => bet.status === 'won')
      .reduce((sum, bet) => sum + bet.actualPayout, 0)
      .toFixed(2),
    activeBets: bets.filter(bet => bet.status === 'pending').length,
    winRate: bets.length > 0 
      ? ((bets.filter(bet => bet.status === 'won').length / bets.filter(bet => bet.status !== 'pending').length) * 100).toFixed(1)
      : 0
  }

  const value = {
    bets,
    placeBet,
    userStats
  }

  return (
    <BetContext.Provider value={value}>
      {children}
    </BetContext.Provider>
  )
}