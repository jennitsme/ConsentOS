'use client';

import { Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Activity, CreditCard, RefreshCw } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Earnings() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Earnings</h1>
          <p className="text-zinc-400 mt-1">Track and withdraw your data monetization revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <CreditCard className="w-4 h-4" />
            Withdraw Funds
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="font-medium">Total Balance</span>
            </div>
            <h2 className="text-5xl font-display font-bold text-white tracking-tight mb-4">$142.50 <span className="text-xl text-zinc-500 font-normal">USDC</span></h2>
            
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-emerald-500/20">
              <div>
                <p className="text-sm text-zinc-400 mb-1">This Month</p>
                <p className="text-xl font-semibold text-white flex items-center gap-2">
                  $34.20 <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> 12%</span>
                </p>
              </div>
              <div className="w-px h-10 bg-emerald-500/20" />
              <div>
                <p className="text-sm text-zinc-400 mb-1">Active Contracts</p>
                <p className="text-xl font-semibold text-white">3</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Top Earning Data</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Blog Posts</p>
                    <p className="text-xs text-zinc-500">Medium</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-400">$85.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Public Tweets</p>
                    <p className="text-xs text-zinc-500">Twitter/X</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-400">$42.50</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Code Repos</p>
                    <p className="text-xs text-zinc-500">GitHub</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-emerald-400">$15.00</span>
              </div>
            </div>
          </div>
          <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
            View Details
          </button>
        </motion.div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Recent Transactions</h2>
          <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
            <RefreshCw className="w-4 h-4" /> Sync
          </button>
        </div>

        <div className="space-y-4">
          {[
            { id: 1, type: 'Payment Received', source: 'Anthropic Claude', amount: '+$1.20', date: 'Today, 10:23 AM', status: 'Completed' },
            { id: 2, type: 'Payment Received', source: 'OpenAI (GPT-4)', amount: '+$5.50', date: 'Yesterday, 2:15 PM', status: 'Completed' },
            { id: 3, type: 'Withdrawal', source: 'Bank Account ending in 4211', amount: '-$50.00', date: 'Oct 12, 2023', status: 'Completed' },
            { id: 4, type: 'Payment Received', source: 'Midjourney', amount: '+$0.80', date: 'Oct 10, 2023', status: 'Completed' },
          ].map((tx, i) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount.startsWith('+') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {tx.amount.startsWith('+') ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{tx.type}</p>
                  <p className="text-xs text-zinc-500">{tx.source}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>{tx.amount}</p>
                <p className="text-xs text-zinc-500">{tx.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
