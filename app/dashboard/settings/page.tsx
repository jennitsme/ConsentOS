'use client';

import { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Key, Globe, LogOut } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; provider: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch session', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSession();
  }, []);

  // Extract initials from name
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Split name for first/last name fields
  const getFirstLastName = (name: string) => {
    if (!name) return { first: '', last: '' };
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return { first: parts[0], last: parts.slice(1).join(' ') };
    }
    return { first: name, last: '' };
  };

  const { first, last } = getFirstLastName(user?.name || '');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-white">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-medium text-sm transition-colors text-left">
            <User className="w-4 h-4" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl font-medium text-sm transition-colors text-left">
            <Shield className="w-4 h-4" /> Privacy & Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl font-medium text-sm transition-colors text-left">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl font-medium text-sm transition-colors text-left">
            <Key className="w-4 h-4" /> API Keys
          </button>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Profile Information</h2>
            
            {isLoading ? (
              <div className="animate-pulse space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-white/5"></div>
                  <div className="space-y-2">
                    <div className="h-8 w-32 bg-white/5 rounded-lg"></div>
                    <div className="h-4 w-48 bg-white/5 rounded"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="h-12 bg-white/5 rounded-xl"></div>
                  <div className="h-12 bg-white/5 rounded-xl"></div>
                  <div className="sm:col-span-2 h-12 bg-white/5 rounded-xl"></div>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl font-bold text-emerald-400 border border-emerald-500/30">
                    {getInitials(user?.name || '')}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-medium text-white transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-xs text-zinc-500 mt-2">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">First Name</label>
                    <input type="text" defaultValue={first} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Last Name</label>
                    <input type="text" defaultValue={last} className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-zinc-400 mb-1.5">Account Identifier (Email/Wallet/Username)</label>
                    <input type="text" disabled defaultValue={user?.name || ''} className="w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-zinc-500 cursor-not-allowed" />
                    <p className="text-xs text-zinc-500 mt-1.5">Logged in via {user?.provider}</p>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold rounded-xl transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-zinc-400 mb-6">Permanently delete your account and all associated data permissions. This action cannot be undone.</p>
            
            <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors">
              Delete Account
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
