import React, { useState } from 'react'
import { Card } from './Card'
import { Button } from './Button'
import { Trophy, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useBets } from '../context/BetContext'

export function BetHistory() {
  const { bets } = useBets()
  const [filter, setFilter] = useState('all')

  const getStatusIcon = (status) => {
    switch (status) {
      case 'won':
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case 'lost':
        return <XCircle className="h-5 w-5 text-red-400" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'won':
        return 'bg-green-600/20 text-green-400'
      case 'lost':
        return 'bg-red-600/20 text-red-400'
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400'
      default:
        return 'bg-gray-600/20 text-gray-400'
    }
  }

  const filteredBets = bets.filter(bet => {
    if (filter === 'all') return true
    return bet.status === filter
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Bet History</h2>
        
        <div className="flex space-x-2">
          {['all', 'pending', 'won', 'lost'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {filteredBets.length === 0 ? (
        <Card className="text-center py-12">
          <Trophy className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No bets found</h3>
          <p className="text-gray-400 mb-4">
            {filter === 'all' ? 'You haven\'t placed any bets yet.' : `No ${filter} bets found.`}
          </p>
          <Button>Start Betting</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBets.map((bet) => (
            <Card key={bet.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(bet.status)}
                    <h3 className="text-lg font-semibold text-white">{bet.eventTitle}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(bet.status)}`}>
                      {bet.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{bet.eventDescription}</p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Bet Outcome</p>
                      <p className="text-white font-medium">{bet.outcome}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Stake Amount</p>
                      <p className="text-white font-medium">{bet.stakeAmount} SOL</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Potential Payout</p>
                      <p className="text-white font-medium">{bet.potentialPayout} SOL</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Date Placed</p>
                      <p className="text-white font-medium">
                        {new Date(bet.creationTimestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {bet.status === 'won' && (
                <div className="mt-4 p-3 bg-green-600/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 font-medium">
                    🎉 Congratulations! You won {bet.actualPayout} SOL
                  </p>
                </div>
              )}
              
              {bet.status === 'lost' && (
                <div className="mt-4 p-3 bg-red-600/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400">
                    Sorry, this bet didn't win. Better luck next time!
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}