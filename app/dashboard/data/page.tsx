'use client';

import { useState, useEffect } from 'react';
import { Shield, Lock, Unlock, DollarSign, Search, Filter, AlertCircle, Loader2, Fingerprint } from 'lucide-react';
import * as motion from 'motion/react-client';

type PermissionLevel = 'denied' | 'restricted' | 'monetized';

interface DataCategory {
  id: string;
  name: string;
  description: string;
  source: string;
  level: PermissionLevel;
  price?: number;
  consentHash?: string;
  solanaSignature?: string;
}

export default function DataPermissions() {
  const [data, setData] = useState<DataCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const res = await fetch('/api/data-permissions');
      const result = await res.json();
      if (result.categories) {
        setData(result.categories);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePermission = async (id: string, newLevel: PermissionLevel, price?: number) => {
    // Optimistic update
    const oldData = [...data];
    setData(data.map(item => item.id === id ? { ...item, level: newLevel, price: price ?? item.price } : item));

    try {
      const res = await fetch('/api/data-permissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, level: newLevel, price }),
      });
      
      if (!res.ok) throw new Error('Failed to update');
      
      // Refresh to get the new hash
      const updatedRes = await res.json();
      setData(data.map(item => item.id === id ? { ...item, ...updatedRes.category } : item));
    } catch (error) {
      console.error('Failed to update permission:', error);
      setData(oldData); // Rollback
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-zinc-400 animate-pulse">Loading data categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Data Permissions</h1>
          <p className="text-zinc-400 mt-1">Control exactly how AI models and apps can use your data.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search data..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-emerald-400">Smart Consent Contracts Active</h4>
          <p className="text-xs text-emerald-400/80 mt-1">
            Any changes made here are instantly hashed and recorded on-chain. Developers must verify these contracts before accessing your data via our API.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-white/10 text-zinc-300">{item.source}</span>
                <h3 className="text-lg font-semibold text-white">{item.name}</h3>
              </div>
              <p className="text-sm text-zinc-400">{item.description}</p>
              {item.consentHash && (
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Fingerprint className="w-3 h-3 text-emerald-500/50" />
                    <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[150px]">
                      Contract: {item.consentHash}
                    </span>
                  </div>
                  {item.solanaSignature && (
                    <a 
                      href={`https://explorer.solana.com/tx/${item.solanaSignature}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      View on Solana
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
              <PermissionButton 
                active={item.level === 'denied'} 
                onClick={() => updatePermission(item.id, 'denied')}
                icon={<Lock className="w-4 h-4" />}
                label="Denied"
                color="red"
              />
              <PermissionButton 
                active={item.level === 'restricted'} 
                onClick={() => updatePermission(item.id, 'restricted')}
                icon={<Shield className="w-4 h-4" />}
                label="Restricted"
                color="amber"
              />
              <PermissionButton 
                active={item.level === 'monetized'} 
                onClick={() => updatePermission(item.id, 'monetized')}
                icon={<DollarSign className="w-4 h-4" />}
                label="Monetize"
                color="emerald"
              />
            </div>

            {item.level === 'monetized' && (
              <div className="flex items-center gap-2 md:w-32">
                <span className="text-sm text-zinc-400">$</span>
                <input 
                  type="number" 
                  defaultValue={item.price}
                  onBlur={(e) => updatePermission(item.id, 'monetized', parseFloat(e.target.value))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white w-full focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="0.00"
                />
                <span className="text-xs text-zinc-500">/1k</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function PermissionButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: 'red' | 'amber' | 'emerald' }) {
  const colors = {
    red: 'bg-red-500/20 text-red-400 border-red-500/30',
    amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  };

  const inactiveColors = 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 border-transparent';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${active ? colors[color] : inactiveColors}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
