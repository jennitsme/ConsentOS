'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, ShieldX, Activity, Database, ArrowRight, Zap, Link as LinkIcon, CheckCircle2, X, Plus, Loader2 } from 'lucide-react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';

export default function DashboardOverview() {
  const [isRevoking, setIsRevoking] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  
  const [activePermissions, setActivePermissions] = useState(0);
  const [dataPoints, setDataPoints] = useState(0);
  const [privacyScore, setPrivacyScore] = useState(0);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, activityRes, connectionsRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/activity'),
        fetch('/api/connections')
      ]);

      const statsData = await statsRes.json();
      const activityData = await activityRes.json();
      const connectionsData = await connectionsRes.json();

      setActivePermissions(statsData.activePermissions || 0);
      setDataPoints(statsData.dataPoints || 0);
      setPrivacyScore(statsData.privacyScore || 0);
      
      if (activityData.activity) {
        setRecentRequests(activityData.activity.map((item: any) => ({
          id: item.id,
          app: item.appName,
          action: item.action,
          time: new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: item.status
        })));
      }

      if (connectionsData.connections) {
        setConnections(connectionsData.connections);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        fetchData(); // Refresh data
      }
      if (event.data?.type === 'OAUTH_AUTH_ERROR') {
        console.error('OAuth Error:', event.data.error);
        alert(`Authentication failed: ${event.data.error}`);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleRevokeAll = async () => {
    if (!confirm('Are you sure you want to revoke ALL data access and disconnect all accounts? This action cannot be undone.')) {
      return;
    }

    setIsRevoking(true);
    try {
      const res = await fetch('/api/revoke-all', {
        method: 'POST',
      });

      if (res.ok) {
        // Refresh all dashboard data
        await fetchData();
        alert('All access has been successfully revoked.');
      } else {
        throw new Error('Failed to revoke access');
      }
    } catch (error) {
      console.error('Error revoking all access:', error);
      alert('Failed to revoke all access. Please try again.');
    } finally {
      setIsRevoking(false);
    }
  };

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/legal-report');
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ConsentOS-Legal-Report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download report:', error);
      alert('Failed to generate legal report.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleConnectSource = async (provider: string, type: string) => {
    try {
      await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          type,
          status: 'connected'
        }),
      });
      // Refresh data after connecting
      await fetchData();
    } catch (error) {
      console.error('Failed to connect source:', error);
    }
  };

  const handleDisconnectSource = async (provider: string) => {
    try {
      await fetch('/api/connections', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider
        }),
      });
      // Refresh data after disconnecting
      await fetchData();
    } catch (error) {
      console.error('Failed to disconnect source:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-zinc-400 animate-pulse">Loading your data footprint...</p>
      </div>
    );
  }

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
            onClick={handleDownloadReport}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            {isDownloading ? 'Generating...' : 'Legal Report'}
          </button>
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
          trend="Live" 
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />} 
          color="emerald"
        />
        <StatCard 
          title="Privacy Score" 
          value={`${privacyScore}/100`} 
          trend={privacyScore > 70 ? "Healthy" : "Action Needed"} 
          icon={<ShieldAlert className="w-5 h-5 text-amber-400" />} 
          color="amber"
        />
        <StatCard 
          title="Data Points Tracked" 
          value={dataPoints.toLocaleString()} 
          trend="Live" 
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
            {connections.length > 0 ? (
              connections.map((conn) => (
                <ConnectionCard 
                  key={conn.id}
                  name={conn.provider} 
                  status={conn.status === 'connected' ? 'Connected' : 'Action Required'} 
                  type={conn.type} 
                  lastSync={new Date(conn.lastSync).toLocaleDateString()} 
                  warning={conn.status !== 'connected'} 
                  privacyScore={conn.privacyScore}
                  dataCount={conn.dataCount}
                />
              ))
            ) : (
              <div className="col-span-full p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                <p className="text-zinc-400 mb-4">No data sources connected yet.</p>
                <button 
                  onClick={() => setIsConnectModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" /> Connect your first source
                </button>
              </div>
            )}
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
            {recentRequests.length > 0 ? (
              recentRequests.map((req, i) => (
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
              ))
            ) : (
              <p className="text-zinc-500 text-sm text-center py-4">No recent activity found.</p>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isConnectModalOpen && (
          <ConnectDataModal 
            onClose={() => setIsConnectModalOpen(false)} 
            onConnect={handleConnectSource}
            onDisconnect={handleDisconnectSource}
            existingConnections={connections.map(c => c.provider)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConnectDataModal({ onClose, onConnect, onDisconnect, existingConnections }: { onClose: () => void, onConnect: (name: string, type: string) => Promise<void>, onDisconnect: (name: string) => Promise<void>, existingConnections: string[] }) {
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
          <SourceOption name="Google Workspace" type="Email, Docs, Drive" connected={existingConnections.includes("Google Workspace")} onConnect={onConnect} onDisconnect={onDisconnect} />
          <SourceOption name="Twitter / X" type="Social Posts, Interactions" connected={existingConnections.includes("Twitter / X")} onConnect={onConnect} onDisconnect={onDisconnect} />
          <SourceOption name="Dropbox" type="Files, Photos" connected={existingConnections.includes("Dropbox")} onConnect={onConnect} onDisconnect={onDisconnect} />
          <SourceOption name="Meta" type="Facebook, Instagram, Ads" connected={existingConnections.includes("Meta")} onConnect={onConnect} onDisconnect={onDisconnect} />
          <SourceOption name="GitHub" type="Code Repositories, Issues" connected={existingConnections.includes("GitHub")} onConnect={onConnect} onDisconnect={onDisconnect} />
          <SourceOption name="LinkedIn" type="Profile, Posts, Connections" connected={existingConnections.includes("LinkedIn")} onConnect={onConnect} onDisconnect={onDisconnect} />
          <SourceOption name="Spotify" type="Listening History, Playlists" connected={existingConnections.includes("Spotify")} onConnect={onConnect} onDisconnect={onDisconnect} />
        </div>
      </motion.div>
    </div>
  );
}

function SourceOption({ name, type, connected, onConnect, onDisconnect }: { name: string, type: string, connected: boolean, onConnect: (name: string, type: string) => Promise<void>, onDisconnect: (name: string) => Promise<void> }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (connected) {
      setIsConnecting(true);
      try {
        await onDisconnect(name);
      } finally {
        setIsConnecting(false);
      }
      return;
    }
    setIsConnecting(true);
    try {
      if (name === 'Google Workspace') {
        const redirectUri = `${window.location.origin}/api/auth/google/callback`;
        const response = await fetch(`/api/auth/google/url?redirectUri=${encodeURIComponent(redirectUri)}`);
        if (!response.ok) throw new Error('Failed to get auth URL');
        const { url } = await response.json();
        
        const authWindow = window.open(
          url,
          'oauth_popup',
          'width=600,height=700'
        );

        if (!authWindow) {
          alert('Please allow popups for this site to connect your account.');
        }
      } else if (name === 'Twitter / X') {
        const redirectUri = `${window.location.origin}/api/auth/twitter/callback`;
        const response = await fetch(`/api/auth/twitter/url?redirectUri=${encodeURIComponent(redirectUri)}`);
        if (!response.ok) throw new Error('Failed to get auth URL');
        const { url } = await response.json();
        
        const authWindow = window.open(
          url,
          'oauth_popup',
          'width=600,height=700'
        );

        if (!authWindow) {
          alert('Please allow popups for this site to connect your account.');
        }
      } else {
        await onConnect(name, type);
      }
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
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
        disabled={isConnecting}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
          connected 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' 
            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
        }`}
      >
        {isConnecting ? (
          <><Activity className="w-4 h-4 animate-spin" /> {connected ? 'Disconnecting...' : 'Connecting...'}</>
        ) : connected ? (
          <><X className="w-4 h-4" /> Disconnect</>
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

function ConnectionCard({ name, status, type, lastSync, privacyScore, dataCount, warning = false }: { name: string, status: string, type: string, lastSync: string, privacyScore: number, dataCount: number, warning?: boolean }) {
  return (
    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors group cursor-pointer relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-[40px] rounded-full pointer-events-none`} />
      
      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center">
            <LinkIcon className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">{name}</h4>
            <p className="text-xs text-zinc-500">{type}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {warning ? (
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          )}
          <span className={`text-[10px] font-bold mt-2 ${privacyScore > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
            Score: {privacyScore}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-white/5 pt-4 relative z-10">
        <div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Data Points</p>
          <p className="text-sm font-semibold text-white">{dataCount.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Status</p>
          <p className={`text-sm font-semibold ${warning ? 'text-amber-400' : 'text-emerald-400'}`}>{status}</p>
        </div>
      </div>

      <div className="mt-4 text-[10px] text-zinc-500 flex justify-between relative z-10">
        <span>Last synced {lastSync}</span>
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
