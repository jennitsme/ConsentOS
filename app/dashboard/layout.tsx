'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, Database, Activity, Wallet, FileText, Settings, LogOut, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; provider: string } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Failed to fetch session', error);
      }
    };
    fetchSession();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="min-h-screen flex bg-zinc-950">
      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col hidden md:flex">
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-zinc-950 border-r border-white/10 flex flex-col md:hidden"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SidebarContent user={user} onLogout={handleLogout} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span className="font-display font-bold text-lg tracking-tight text-white">ConsentOS</span>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 text-zinc-400 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ user, onLogout }: { user: { name: string; provider: string } | null, onLogout: () => void }) {
  return (
    <>
      <div className="p-6 flex items-center gap-2 border-b border-white/5">
        <ShieldCheck className="w-6 h-6 text-emerald-400" />
        <span className="font-display font-bold text-xl tracking-tight text-white">ConsentOS</span>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-4 px-3">Overview</div>
        <NavLink href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />}>Dashboard</NavLink>
        <NavLink href="/dashboard/data" icon={<Database className="w-4 h-4" />}>My Data</NavLink>
        <NavLink href="/dashboard/activity" icon={<Activity className="w-4 h-4" />}>Activity Log</NavLink>
        
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-8 px-3">Monetization</div>
        <NavLink href="/dashboard/wallet" icon={<Wallet className="w-4 h-4" />}>Earnings</NavLink>
        <NavLink href="/dashboard/contracts" icon={<FileText className="w-4 h-4" />}>Contracts</NavLink>
        
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 mt-8 px-3">Settings</div>
        <NavLink href="/dashboard/settings" icon={<Settings className="w-4 h-4" />}>Preferences</NavLink>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 bg-white/[0.02] rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 capitalize">{user.provider} Login</p>
            </div>
          </div>
        )}
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );
}

function NavLink({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isActive 
          ? 'text-emerald-400 bg-emerald-500/10' 
          : 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/5'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
}
