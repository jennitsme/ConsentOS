'use client';

import { Activity, Clock, Search, Filter, ArrowUpRight, ShieldAlert, ShieldCheck, Download } from 'lucide-react';
import * as motion from 'motion/react-client';

const activities = [
  { id: 1, app: 'OpenAI (GPT-4)', action: 'Requested access to public tweets for model training', time: '10 mins ago', status: 'approved', hash: '0x8f...3d2a' },
  { id: 2, app: 'Midjourney', action: 'Requested access to Instagram photos', time: '2 hours ago', status: 'denied', hash: '0x1a...9b4c' },
  { id: 3, app: 'Grammarly', action: 'Accessed Google Docs for grammar checking', time: '5 hours ago', status: 'active', hash: '0x4c...2e1f' },
  { id: 4, app: 'Unknown AI Scraper', action: 'Attempted to scrape LinkedIn profile', time: '1 day ago', status: 'blocked', hash: '0x9d...7a5b' },
  { id: 5, app: 'Anthropic Claude', action: 'Requested access to Medium blog posts', time: '2 days ago', status: 'monetized', hash: '0x2b...8c4d', earnings: '+$1.20' },
  { id: 6, app: 'Runway ML', action: 'Requested access to YouTube videos', time: '3 days ago', status: 'denied', hash: '0x5e...1f3a' },
];

export default function ActivityLog() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Activity Log</h1>
          <p className="text-zinc-400 mt-1">A transparent, immutable record of who accessed your data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors text-white">
            <Download className="w-4 h-4" />
            Export Legal Report
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Timeline</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="bg-zinc-900 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-48"
              />
            </div>
          </div>
        </div>

        <div className="relative border-l border-white/10 ml-3 space-y-8 pb-4">
          {activities.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-8"
            >
              <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-zinc-950 ${getStatusColor(item.status)}`} />
              
              <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white">{item.app}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                    {item.earnings && (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        {item.earnings}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
                
                <p className="text-sm text-zinc-400 mb-3">{item.action}</p>
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                    <ShieldCheck className="w-3 h-3 text-emerald-500/50" />
                    Contract Hash: {item.hash}
                  </div>
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    View on Explorer <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'approved': return 'bg-emerald-500';
    case 'denied': return 'bg-red-500';
    case 'active': return 'bg-blue-500';
    case 'blocked': return 'bg-amber-500';
    case 'monetized': return 'bg-emerald-400';
    default: return 'bg-zinc-500';
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'approved': return 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/20';
    case 'denied': return 'text-red-400 bg-red-400/10 border border-red-500/20';
    case 'active': return 'text-blue-400 bg-blue-400/10 border border-blue-500/20';
    case 'blocked': return 'text-amber-400 bg-amber-400/10 border border-amber-500/20';
    case 'monetized': return 'text-emerald-400 bg-emerald-400/10 border border-emerald-500/20';
    default: return 'text-zinc-400 bg-zinc-400/10 border border-zinc-500/20';
  }
}
