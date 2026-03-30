import React, { useState, useEffect } from 'react';
import { BarChart, Wallet, TrendingUp, Target, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch of the analysis results
    // In a real app, this would come from an API
    const analysisResults = {
      totalBets: 5826,
      profit: 0.00001104,
      wagered: 0.00186181,
      payout: 0.00187285,
      games: [
        { name: 'Dice', bets: 5522, winRate: 50.38, wins: 2782, losses: 2740 },
        { name: 'Keno', bets: 303, winRate: 47.19, wins: 143, losses: 160 },
        { name: 'Hilo', bets: 1, winRate: 0.00, wins: 0, losses: 1 }
      ]
    };
    
    setTimeout(() => {
      setStats(analysisResults);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Activity className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-6xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agentic IDE Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Multi-Drive Support & Workspace Analysis</p>
        </header>
        
        {/* Drive Info Section */}
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">ALL ACCESS MODE ACTIVE</h2>
                    <p className="opacity-80 text-sm font-mono max-w-xl">You can now browse, edit, and orchestrate tasks across your entire machine: C:, G:, H:, OneDrive, and User Profiles.</p>
                </div>
                <div className="flex -space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30" title="Local Drive C:">C:</div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30" title="Google Drive G:">G:</div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/30" title="Google Drive H:">H:</div>
                    <div className="w-12 h-12 rounded-full bg-white/40 backdrop-blur flex items-center justify-center border-2 border-white/50" title="OneDrive">☁️</div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Bets" 
            value={stats.totalBets.toLocaleString()} 
            icon={<Target className="w-5 h-5 text-blue-500" />}
          />
          <StatCard 
            title="Total Profit" 
            value={`${stats.profit.toFixed(8)} BNB`} 
            icon={<TrendingUp className="w-5 h-5 text-green-500" />}
            isPositive={stats.profit > 0}
          />
          <StatCard 
            title="Total Wagered" 
            value={`${stats.wagered.toFixed(6)} BNB`} 
            icon={<Wallet className="w-5 h-5 text-purple-500" />}
          />
          <StatCard 
            title="Win Rate (Avg)" 
            value={`${(stats.games.reduce((acc: any, curr: any) => acc + curr.winRate, 0) / stats.games.length).toFixed(1)}%`} 
            icon={<BarChart className="w-5 h-5 text-orange-500" />}
          />
        </div>

        {/* Game Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white">Game Performance Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Game</th>
                  <th className="px-6 py-3">Total Bets</th>
                  <th className="px-6 py-3">Win Rate</th>
                  <th className="px-6 py-3">Wins</th>
                  <th className="px-6 py-3">Losses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {stats.games.map((game: any) => (
                  <tr key={game.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{game.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{game.bets.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 dark:text-white">{game.winRate.toFixed(2)}%</span>
                        <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${game.winRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-green-600 dark:text-green-400">{game.wins.toLocaleString()}</td>
                    <td className="px-6 py-4 text-red-600 dark:text-red-400">{game.losses.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, isPositive }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
        {icon}
      </div>
      {isPositive !== undefined && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {isPositive ? 'PROFIT' : 'LOSS'}
        </span>
      )}
    </div>
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  </div>
);
