'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, ShieldX, Activity, Database, ArrowRight, Zap, Link as LinkIcon, CheckCircle2, X, Plus } from 'lucide-react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';

const possibleApps = ["Anthropic Claude", "Runway ML", "GitHub Copilot", "Meta AI", "Google Gemini", "Unknown Crawler", "DataBroker Inc."];
const possibleActions = ["Requested access to blog posts", "Attempted to scrape profile", "Accessed code repositories", "Requested access to photos", "Accessed public tweets", "Requested email metadata"];
const possibleStatuses: ('approved' | 'denied' | 'active' | 'blocked')[] = ["approved", "denied", "active", "blocked"];

export default function DashboardOverview() {
  const [isRevoking, setIsRevoking] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [activePermissions, setActivePermissions] = useState(24);
  const [dataPoints, setDataPoints] = useState(1432);
  const [recentRequests, setRecentRequests] = useState([
    { id: 1, app: "OpenAI (GPT-4)", action: "Requested access to public tweets", time: "Just now", status: "approved" as const },
    { id: 2, app: "Midjourney", action: "Requested access to Instagram photos", time: "2 mins ago", status: "denied" as const },
    { id: 3, app: "Grammarly", action: "Accessed Google Docs", time: "5 mins ago", status: "active" as const },
    { id: 4, app: "Unknown AI Scraper", action: "Attempted to scrape LinkedIn profile", time: "10 mins ago", status: "blocked" as const },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate data points increasing
      setDataPoints(prev => prev + Math.floor(Math.random() * 5) + 1);
      
      // Simulate active permissions fluctuating slightly
      if (Math.random() > 0.7) {
        setActivePermissions(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }

      // Simulate new incoming requests
      if (Math.random() > 0.6) {
        const newRequest = {
          id: Date.now(),
          app: possibleApps[Math.floor(Math.random() * possibleApps.length)],
          action: possibleActions[Math.floor(Math.random() * possibleActions.length)],
          time: "Just now",
          status: possibleStatuses[Math.floor(Math.random() * possibleStatuses.length)],
        };
        
        setRecentRequests(prev => {
          const updated = [newRequest, ...prev].slice(0, 4);
          // Update times for older requests
          return updated.map((req, i) => {
            if (i === 0) return req;
            if (req.time === "Just now") return { ...req, time: "1 min ago" };
            if (req.time.includes("min")) {
              const mins = parseInt(req.time) + 1;
              return { ...req, time: `${mins} mins ago` };
            }
            return req;
          });
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRevokeAll = () => {
    setIsRevoking(true);
    setTimeout(() => {
      setIsRevoking(false);
      setActivePermissions(0);
      setRecentRequests(prev => prev.map(req => ({ ...req, status: 'blocked' })));
    }, 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Overview</h1>
          <p className="text-zinc-400 mt-1">Manage your data permissions across all connected platforms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRevokeAll}
            disabled={isRevoking}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isRevoking ? <Activity className="w-4 h-4 animate-spin" /> : <ShieldX className="w-4 h-4" />}
            {isRevoking ? 'Revoking...' : 'Revoke All Access'}
          </button>
          <button 
            onClick={() => setIsConnectModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Zap className="w-4 h-4" />
            Connect Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Active Permissions" 
          value={activePermissions.toString()} 
          trend="Live updating" 
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} 
          color="emerald"
        />
        <StatCard 
          title="Restricted Access" 
          value="12" 
          trend="Stable" 
          icon={<ShieldAlert className="w-5 h-5 text-amber-400" />} 
          color="amber"
        />
        <StatCard 
          title="Data Points Tracked" 
          value={dataPoints.toLocaleString()} 
          trend="Live updating" 
          icon={<Database className="w-5 h-5 text-blue-400" />} 
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Connected Accounts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Connected Sources</h2>
            <button className="text-sm text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ConnectionCard name="Google Workspace" status="Connected" type="Email & Docs" lastSync="2 mins ago" />
            <ConnectionCard name="Twitter / X" status="Connected" type="Social Posts" lastSync="1 hour ago" />
            <ConnectionCard name="Dropbox" status="Connected" type="Files & Photos" lastSync="3 hours ago" />
            <ConnectionCard name="Meta" status="Action Required" type="Social & Ads" lastSync="2 days ago" warning />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              Recent Requests
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </h2>
          </div>
          
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-4 overflow-hidden relative">
            {recentRequests.map((req, i) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <ActivityItem 
                  app={req.app} 
                  action={req.action} 
                  time={req.time} 
                  status={req.status}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isConnectModalOpen && (
          <ConnectDataModal onClose={() => setIsConnectModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConnectDataModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-lg bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Connect Data Source</h2>
            <p className="text-sm text-zinc-400 mt-1">Link your accounts to start tracking your data footprint.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <SourceOption name="Google Workspace" type="Email, Docs, Drive" connected={true} />
          <SourceOption name="Twitter / X" type="Social Posts, Interactions" connected={true} />
          <SourceOption name="Dropbox" type="Files, Photos" connected={true} />
          <SourceOption name="Meta" type="Facebook, Instagram, Ads" connected={false} />
          <SourceOption name="GitHub" type="Code Repositories, Issues" connected={false} />
          <SourceOption name="LinkedIn" type="Profile, Posts, Connections" connected={false} />
          <SourceOption name="Spotify" type="Listening History, Playlists" connected={false} />
        </div>
      </motion.div>
    </div>
  );
}

function SourceOption({ name, type, connected }: { name: string, type: string, connected: boolean }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(connected);

  const handleConnect = () => {
    if (isConnected) return;
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
          <LinkIcon className="w-4 h-4 text-zinc-400" />
        </div>
        <div>
          <h4 className="font-medium text-white">{name}</h4>
          <p className="text-xs text-zinc-500">{type}</p>
        </div>
      </div>
      <button 
        onClick={handleConnect}
        disabled={isConnected || isConnecting}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
          isConnected 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
        }`}
      >
        {isConnecting ? (
          <><Activity className="w-4 h-4 animate-spin" /> Connecting...</>
        ) : isConnected ? (
          <><CheckCircle2 className="w-4 h-4" /> Connected</>
        ) : (
          <><Plus className="w-4 h-4" /> Connect</>
        )}
      </button>
    </div>
  );
}

function StatCard({ title, value, trend, icon, color }: { title: string, value: string, trend: string, icon: React.ReactNode, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 blur-[50px] rounded-full pointer-events-none`} />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center border border-${color}-500/20`}>
          {icon}
        </div>
        <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
          {trend === 'Live updating' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
          {trend}
        </span>
      </div>
      <h3 className="text-3xl font-display font-bold text-white mb-1 relative z-10">{value}</h3>
      <p className="text-sm text-zinc-400 relative z-10">{title}</p>
    </motion.div>
  );
}

function ConnectionCard({ name, status, type, lastSync, warning = false }: { name: string, status: string, type: string, lastSync: string, warning?: boolean }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors group cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
            <LinkIcon className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{name}</h4>
            <p className="text-xs text-zinc-500">{type}</p>
          </div>
        </div>
        {warning ? (
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        )}
      </div>
      <div className="flex items-center justify-between mt-4 text-xs">
        <span className={warning ? "text-amber-400" : "text-emerald-400"}>{status}</span>
        <span className="text-zinc-500">Synced {lastSync}</span>
      </div>
    </div>
  );
}

function ActivityItem({ app, action, time, status }: { app: string, action: string, time: string, status: 'approved' | 'denied' | 'active' | 'blocked' }) {
  const statusColors = {
    approved: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20',
    denied: 'text-red-400 bg-red-400/10 border-red-500/20',
    active: 'text-blue-400 bg-blue-400/10 border-blue-500/20',
    blocked: 'text-amber-400 bg-amber-400/10 border-amber-500/20',
  };

  return (
    <div className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
      <div className={`mt-1.5 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${status === 'approved' || status === 'active' ? 'text-emerald-500 bg-emerald-500' : status === 'blocked' ? 'text-amber-500 bg-amber-500' : 'text-red-500 bg-red-500'}`} />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">{app}</p>
          <span className="text-xs font-mono text-zinc-500">{time}</span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">{action}</p>
        <div className="mt-2 inline-flex">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
