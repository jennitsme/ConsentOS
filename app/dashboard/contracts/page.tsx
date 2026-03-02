'use client';

import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, ExternalLink, Search, Filter } from 'lucide-react';
import * as motion from 'motion/react-client';

interface Contract {
  id: string;
  appName: string;
  status: string;
  consentHash: string | null;
  solanaSignature: string | null;
  createdAt: string;
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch('/api/dashboard/contracts');
        if (res.ok) {
          const data = await res.json();
          setContracts(data.contracts || []);
        }
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExpirationDate = (dateString: string) => {
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() + 1); // Assuming 1 year expiration for demo
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-white">Smart Contracts</h1>
          <p className="text-zinc-400 mt-1">Manage your cryptographic consent agreements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search contracts..." 
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-white/5">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">Contract ID</th>
                <th scope="col" className="px-6 py-4 font-medium">Entity</th>
                <th scope="col" className="px-6 py-4 font-medium">Type</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium">Issued / Expires</th>
                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                      Loading contracts...
                    </div>
                  </td>
                </tr>
              ) : contracts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                    No contracts found.
                  </td>
                </tr>
              ) : (
                contracts.map((contract, index) => (
                  <motion.tr 
                    key={contract.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-white">
                      {contract.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 font-medium text-white">{contract.appName}</td>
                    <td className="px-6 py-4">Data Access</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(contract.status)}`}>
                        {getStatusIcon(contract.status)}
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white">{formatDate(contract.createdAt)}</span>
                        <span className="text-xs text-zinc-500">{getExpirationDate(contract.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {contract.solanaSignature ? (
                        <a 
                          href={`https://explorer.solana.com/tx/${contract.solanaSignature}?cluster=mainnet-beta`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button className="text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1 transition-colors">
                          View <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function getStatusStyles(status: string) {
  switch (status) {
    case 'active': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'revoked': return 'bg-red-500/10 text-red-400 border border-red-500/20';
    case 'expired': return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    default: return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'active': return <CheckCircle2 className="w-3 h-3" />;
    case 'revoked': return <XCircle className="w-3 h-3" />;
    case 'expired': return <Clock className="w-3 h-3" />;
    default: return null;
  }
}
