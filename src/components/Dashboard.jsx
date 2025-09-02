import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { TrendingUp, Users, DollarSign, Activity, Loader2, ExternalLink } from 'lucide-react';
import { useBets } from '../context/BetContext';
import { useWallet } from '../context/WalletContext';
import { getExplorerUrl } from '../utils/solana';
import { Button } from './Button';

export function Dashboard() {
  const { userStats, bets, isLoading } = useBets();
  const { isConnected, walletAddress, balance } = useWallet();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Refresh last updated time
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Get recent activity from bets
  const recentActivity = bets
    .slice(0, 5)
    .map(bet => ({
      id: bet.id,
      event: bet.eventTitle,
      amount: `${bet.stakeAmount} SOL`,
      status: bet.status.charAt(0).toUpperCase() + bet.status.slice(1),
      time: formatTimeAgo(bet.creationTimestamp),
      signature: bet.signature,
    }));

  // Stats data
  const stats = [
    {
      title: 'Total Staked',
      value: `${userStats.totalStaked} SOL`,
      icon: DollarSign,
      change: isConnected ? `Balance: ${balance.toFixed(2)} SOL` : '',
      positive: true
    },
    {
      title: 'Total Winnings',
      value: `${userStats.totalWinnings} SOL`,
      icon: TrendingUp,
      change: '',
      positive: true
    },
    {
      title: 'Active Bets',
      value: userStats.activeBets,
      icon: Activity,
      change: '',
      positive: true
    },
    {
      title: 'Win Rate',
      value: `${userStats.winRate}%`,
      icon: Users,
      change: '',
      positive: true
    }
  ];

  // Generate chart data based on bets
  const generateChartData = () => {
    // Use actual bet data to generate chart heights
    // For simplicity, we'll use a random value if not enough bets
    const chartData = Array(12).fill(0);
    
    bets.slice(0, 12).forEach((bet, index) => {
      chartData[index] = bet.stakeAmount * 10; // Scale for visibility
    });
    
    // Fill remaining with random data
    for (let i = 0; i < chartData.length; i++) {
      if (chartData[i] === 0) {
        chartData[i] = Math.random() * 80 + 20;
      }
    }
    
    return chartData;
  };

  const chartData = generateChartData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">Dashboard</h2>
        <div className="text-sm text-gray-400">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
      
      {isLoading ? (
        <Card className="p-8 text-center">
          <Loader2 className="h-8 w-8 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard data...</p>
        </Card>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      {stat.change && (
                        <div className="flex items-center mt-2">
                          <span className={`text-sm ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                            {stat.change}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 bg-purple-600/20 rounded-lg">
                      <Icon className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Betting Activity</h3>
              {!isConnected && (
                <Button size="sm" onClick={() => document.querySelector('[data-wallet-connect]')?.click()}>
                  Connect Wallet
                </Button>
              )}
            </div>
            <div className="h-64 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-lg flex items-end justify-around p-4">
              {chartData.map((height, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-sm"
                  style={{
                    height: `${height}%`,
                    width: '20px'
                  }}
                />
              ))}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <Button size="sm" variant="outline" onClick={() => window.location.href = '#/history'}>
                View All
              </Button>
            </div>
            
            {recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No recent activity</p>
                <Button className="mt-4" onClick={() => window.location.href = '#/betting'}>
                  Start Betting
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{activity.event}</p>
                      <p className="text-sm text-gray-400">{activity.time}</p>
                      
                      {activity.signature && (
                        <a
                          href={getExplorerUrl(activity.signature)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-purple-400 hover:text-purple-300 flex items-center mt-1 w-fit"
                        >
                          View Transaction
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      )}
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
            )}
          </Card>
        </>
      )}
    </div>
  );
}
