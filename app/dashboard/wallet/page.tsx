'use client';

import { useState, useEffect } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, DollarSign, Activity, CreditCard, RefreshCw, Loader2 } from 'lucide-react';
import * as motion from 'motion/react-client';

interface Transaction {
  id: string;
  type: string;
  source: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface WalletData {
  balance: number;
  monthlyEarnings: number;
  activeContracts: number;
  topSources: { name: string, amount: number }[];
  transactions: Transaction[];
}

export default function Earnings() {
  const [data, setData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const fetchWalletData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/wallet');
      const result = await res.json();
      if (result) {
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleWithdraw = async () => {
    if (!data || data.balance <= 0) return;
    
    setIsWithdrawing(true);
    try {
      const res = await fetch('/api/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: data.balance, source: 'Bank Account ending in 4211' }),
      });
      
      if (res.ok) {
        await fetchWalletData();
        alert('Withdrawal successful!');
      }
    } catch (error) {
      console.error('Withdrawal failed:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-zinc-400 animate-pulse">Loading financial data...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Earnings</h1>
          <p className="text-zinc-400 mt-1">Track and withdraw your data monetization revenue.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleWithdraw}
            disabled={isWithdrawing || data.balance <= 0}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWithdrawing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
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
            <h2 className="text-5xl font-display font-bold text-white tracking-tight mb-4">${data.balance.toFixed(2)} <span className="text-xl text-zinc-500 font-normal">USDC</span></h2>
            
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-emerald-500/20">
              <div>
                <p className="text-sm text-zinc-400 mb-1">This Month</p>
                <p className="text-xl font-semibold text-white flex items-center gap-2">
                  ${data.monthlyEarnings.toFixed(2)} <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> 12%</span>
                </p>
              </div>
              <div className="w-px h-10 bg-emerald-500/20" />
              <div>
                <p className="text-sm text-zinc-400 mb-1">Active Contracts</p>
                <p className="text-xl font-semibold text-white">{data.activeContracts}</p>
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
              {data.topSources.map((source, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${i === 0 ? 'bg-blue-500/10' : i === 1 ? 'bg-sky-500/10' : 'bg-purple-500/10'} flex items-center justify-center`}>
                      <DollarSign className={`w-4 h-4 ${i === 0 ? 'text-blue-400' : i === 1 ? 'text-sky-400' : 'text-purple-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{source.name}</p>
                      <p className="text-xs text-zinc-500">Source</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">${source.amount.toFixed(2)}</span>
                </div>
              ))}
              {data.topSources.length === 0 && (
                <p className="text-zinc-500 text-sm text-center py-4">No earnings yet.</p>
              )}
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
          <button 
            onClick={fetchWalletData}
            className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <RefreshCw className="w-4 h-4" /> Sync
          </button>
        </div>

        <div className="space-y-4">
          {data.transactions.map((tx, i) => (
            <motion.div 
              key={tx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {tx.amount > 0 ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{tx.type === 'payment' ? 'Payment Received' : 'Withdrawal'}</p>
                  <p className="text-xs text-zinc-500">{tx.source}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.amount > 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
                </p>
                <p className="text-xs text-zinc-500">{new Date(tx.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            </motion.div>
          ))}
          {data.transactions.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-8">No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
