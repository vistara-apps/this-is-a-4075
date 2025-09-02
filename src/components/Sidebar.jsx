import React from 'react'
import { 
  LayoutDashboard, 
  Trophy, 
  History, 
  Wallet, 
  Settings,
  HelpCircle,
  TrendingUp
} from 'lucide-react'
import { clsx } from 'clsx'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'betting', label: 'Betting', icon: Trophy },
  { id: 'history', label: 'Bet History', icon: History },
  { id: 'wallet', label: 'Wallet', icon: Wallet },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
]

const bottomItems = [
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
]

export function Sidebar({ activeView, setActiveView }) {
  return (
    <aside className="w-64 glass-effect border-r border-white/10 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg">BetHub</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={clsx(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all',
                    activeView === item.id
                      ? 'bg-purple-600/20 text-purple-300 border-r-2 border-purple-500'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <ul className="space-y-2">
          {bottomItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-300 hover:bg-white/5 hover:text-white transition-all">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}