'use client';

import { useState } from 'react';
import { ShieldCheck, Search, Copy, ExternalLink, Code, Terminal, CheckCircle2, XCircle } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function CompliancePage() {
  const [identifier, setIdentifier] = useState('');
  const [category, setCategory] = useState('Public Tweets');
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkCompliance = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/compliance/check?identifier=${encodeURIComponent(identifier)}&category=${encodeURIComponent(category)}`);
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || data.message || 'Failed to check compliance');
        setResult(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const apiExample = `curl "${typeof window !== 'undefined' ? window.location.origin : ''}/api/compliance/check?identifier=${identifier || 'USER_EMAIL'}&category=${category}"`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight text-white">AI Compliance API</h1>
        <p className="text-zinc-400 mt-1">Proof-of-Consent verification for AI companies and data scrapers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* API Tester */}
        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Compliance Checker (Simulator)
            </h3>
            <p className="text-sm text-zinc-400">
              Enter a user identifier and data category to verify their current consent status and cryptographic proof.
            </p>
            
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1.5">User Identifier (Email or Name)</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. user@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase mb-1.5">Data Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Public Tweets">Public Tweets</option>
                  <option value="Code Repositories">Code Repositories</option>
                  <option value="Private Photos">Private Photos</option>
                  <option value="Voice Notes">Voice Notes</option>
                  <option value="Blog Posts">Blog Posts</option>
                </select>
              </div>

              <button 
                onClick={checkCompliance}
                disabled={isLoading || !identifier}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-sm font-bold transition-all disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify Consent Status'}
              </button>
            </div>
          </div>

          <div className="bg-zinc-950 border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-zinc-400" />
                Developer API Endpoint
              </h3>
              <button 
                onClick={() => copyToClipboard(apiExample)}
                className="p-1.5 hover:bg-white/5 rounded text-zinc-500 hover:text-white transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-black/50 rounded-lg p-4 font-mono text-xs text-emerald-400/80 break-all">
              {apiExample}
            </div>
            <p className="text-[10px] text-zinc-500 italic">
              * AI companies are required to call this endpoint before processing any user data to ensure legal compliance with ConsentOS Data Charter.
            </p>
          </div>
        </div>

        {/* Results Display */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl">
              <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
              <p className="text-zinc-500 text-sm">Querying ConsentOS Registry...</p>
            </div>
          ) : error ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full min-h-[400px] flex flex-col items-center justify-center bg-red-500/5 border border-red-500/20 rounded-2xl p-8 text-center"
            >
              <XCircle className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Verification Failed</h3>
              <p className="text-zinc-400 text-sm max-w-xs">{error}</p>
            </motion.div>
          ) : result ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 space-y-8"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${result.status === 'denied' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {result.status === 'denied' ? <XCircle className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{result.status}</h3>
                    <p className="text-xs text-zinc-500">Permission Level</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-zinc-500">ID: {result.compliance.consentHash?.substring(0, 10)}...</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">User</p>
                  <p className="text-sm text-white font-medium">{result.user}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Category</p>
                  <p className="text-sm text-white font-medium">{result.category}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cryptographic Proof</h4>
                <div className="space-y-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] text-zinc-500 mb-1">Consent Hash (SHA-256)</p>
                    <p className="text-[10px] font-mono text-emerald-400 break-all">{result.compliance.consentHash}</p>
                  </div>
                  <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                    <p className="text-[10px] text-zinc-500 mb-1">Solana Transaction Signature</p>
                    <p className="text-[10px] font-mono text-emerald-400 break-all">{result.compliance.solanaSignature || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {result.compliance.proofUrl && (
                <a 
                  href={result.compliance.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
                >
                  Verify on Solana Explorer <ExternalLink className="w-3 h-3" />
                </a>
              )}

              {result.monetization && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-400">Monetization Active</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">${result.monetization.pricePer1k} {result.monetization.currency} / 1k units</span>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/[0.01] border border-dashed border-white/10 rounded-2xl p-8 text-center">
              <ShieldCheck className="w-12 h-12 text-zinc-800 mb-4" />
              <h3 className="text-lg font-bold text-zinc-500 mb-2">Ready for Verification</h3>
              <p className="text-zinc-600 text-sm max-w-xs">Enter user details to fetch their cryptographic consent status from the ConsentOS registry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
