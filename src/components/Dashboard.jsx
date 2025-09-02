import React from 'react'
import { Card } from './Card'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { useBets } from '../context/BetContext'

export function Dashboard() {
  const { userStats } = useBets()

  const stats = [
    {
      title: 'Total Staked',
      value: `${userStats.totalStaked} SOL`,
      icon: DollarSign,
      change: '+12.5%',
      positive: true
    },
    {
      title: 'Total Winnings',
      value: `${userStats.totalWinnings} SOL`,
      icon: TrendingUp,
      change: '+8.2%',
      positive: true
    },
    {
      title: 'Active Bets',
      value: userStats.activeBets,
      icon: Activity,
      change: '+3',
      positive: true
    },
    {
      title: 'Win Rate',
      value: `${userStats.winRate}%`,
      icon: Users,
      change: '+5.4%',
      positive: true
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Dashboard</h2>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-600/20 rounded-lg">
                  <Icon className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Chart Placeholder */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Betting Activity</h3>
        <div className="h-64 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg flex items-end justify-around p-4">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-sm"
              style={{
                height: `${Math.random() * 80 + 20}%`,
                width: '20px'
              }}
            />
          ))}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { event: 'NBA Finals Game 7', amount: '2.5 SOL', status: 'Won', time: '2 hours ago' },
            { event: 'Champions League Final', amount: '1.0 SOL', status: 'Pending', time: '1 day ago' },
            { event: 'World Cup Semi-Final', amount: '3.0 SOL', status: 'Lost', time: '3 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">{activity.event}</p>
                <p className="text-sm text-gray-400">{activity.time}</p>
              </div>
              <div className="text-right">
                <p className="text-white">{activity.amount}</p>
                <span className={`text-sm px-2 py-1 rounded ${
                  activity.status === 'Won' ? 'bg-green-600/20 text-green-400' :
                  activity.status === 'Lost' ? 'bg-red-600/20 text-red-400' :
                  'bg-yellow-600/20 text-yellow-400'
                }`}>
                  {activity.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}