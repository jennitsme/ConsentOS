'use client';

import Link from 'next/link';
import { 
  ArrowRight, ShieldCheck, Database, Lock, Zap, Activity, 
  ChevronRight, Globe, Cpu, FileText,
  Twitter, Github, Linkedin, Terminal, Code, Fingerprint,
  CheckCircle2, Menu, X
} from 'lucide-react';
import * as motion from 'motion/react-client';
import { AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-zinc-950" />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">ConsentOS</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</Link>
            <Link href="#about" className="hover:text-emerald-400 transition-colors">About</Link>
            <Link href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/dashboard" className="relative group text-sm font-medium bg-emerald-500 text-zinc-950 px-5 py-2 rounded-full transition-all overflow-hidden hidden sm:flex">
              <span className="relative z-10 flex items-center gap-2">
                Open App <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-emerald-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
            </Link>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/5 bg-zinc-950 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4 text-zinc-400 font-medium">
                <Link href="#features" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-400 transition-colors">Features</Link>
                <Link href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-400 transition-colors">How it Works</Link>
                <Link href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-400 transition-colors">About</Link>
                <Link href="#faq" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-400 transition-colors">FAQ</Link>
                <div className="pt-4 flex flex-col gap-4 border-t border-white/5">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-white">Log in</Link>
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="bg-emerald-500 text-zinc-950 px-5 py-3 rounded-xl text-center font-bold">
                    Open App
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex items-center">
        {/* Animated High-tech Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/20 blur-[150px] rounded-full pointer-events-none" 
        />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            SYSTEM_ONLINE // V1.0.4
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl leading-[1.05]"
          >
            Take Back Control of Your <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">Personal Data</span>
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-transparent rounded-full"
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
          >
            The central command for your digital footprint in the AI era. Track, manage, and monetize how your content is used by AI models and applications.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href="/dashboard" className="w-full sm:w-auto group relative flex items-center justify-center gap-2 bg-emerald-500 text-zinc-950 px-8 py-4 rounded-full font-semibold overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Initialize Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-emerald-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <div className="absolute inset-0 shadow-[0_0_40px_rgba(16,185,129,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link href="#how-it-works" className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-full font-medium transition-all hover:border-white/20">
              <Terminal className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
              View Documentation
            </Link>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-[10%] hidden lg:flex items-center gap-3 bg-zinc-900/80 border border-white/10 p-4 rounded-2xl backdrop-blur-md"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-mono">DATA_SYNC</p>
            <p className="text-sm font-semibold text-white">1,432 Records</p>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-[10%] hidden lg:flex items-center gap-3 bg-zinc-900/80 border border-white/10 p-4 rounded-2xl backdrop-blur-md"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 font-mono">CONTRACT_STATUS</p>
            <p className="text-sm font-semibold text-emerald-400">Secured</p>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Engineered for the AI Era</h2>
            <p className="text-zinc-400 text-lg">Comprehensive tools to protect, monitor, and monetize your digital identity across the internet.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Globe className="w-6 h-6 text-blue-400" />,
                title: "Universal Tracking",
                desc: "Connect your accounts to scan your data footprint across social media, cloud storage, and the web.",
                color: "blue"
              },
              {
                icon: <Lock className="w-6 h-6 text-emerald-400" />,
                title: "Smart Contracts",
                desc: "Issue cryptographic consent contracts that developers and AI models must verify before accessing data.",
                color: "emerald"
              },
              {
                icon: <Activity className="w-6 h-6 text-amber-400" />,
                title: "Real-time Alerts",
                desc: "Get notified instantly when an AI model requests your data, and approve or deny with one click.",
                color: "amber"
              },
              {
                icon: <Zap className="w-6 h-6 text-red-400" />,
                title: "Universal Revoke",
                desc: "A single 'kill switch' to instantly revoke all data access permissions across all connected platforms.",
                color: "red"
              },
              {
                icon: <Database className="w-6 h-6 text-purple-400" />,
                title: "Data Monetization",
                desc: "Set your price. Let AI companies pay you directly for using your high-quality content for training.",
                color: "purple"
              },
              {
                icon: <FileText className="w-6 h-6 text-zinc-400" />,
                title: "Legal Compliance",
                desc: "Generate verifiable reports of your data usage for legal audits and regulatory compliance.",
                color: "zinc"
              }
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-all overflow-hidden"
              >
                {/* Hover Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${feat.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className={`w-14 h-14 rounded-2xl bg-${feat.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-${feat.color}-500/20 relative z-10`}>
                  {feat.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white relative z-10">{feat.title}</h3>
                <p className="text-zinc-400 leading-relaxed relative z-10">{feat.desc}</p>
                
                {/* Bottom glowing line on hover */}
                <div className={`absolute bottom-0 left-0 h-1 w-0 bg-${feat.color}-500 group-hover:w-full transition-all duration-500 ease-out`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 bg-zinc-900/30 border-y border-white/5 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-24"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Execution Protocol</h2>
            <p className="text-zinc-400 text-lg">Three simple steps to secure your digital footprint.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-white/5">
              <motion.div 
                initial={{ scaleX: 0, transformOrigin: "left" }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0"
              />
            </div>

            {[
              {
                step: "01",
                title: "Connect Sources",
                desc: "Link your email, social media, and cloud storage. We scan for your data footprint securely.",
                icon: <Globe className="w-6 h-6 text-emerald-400" />
              },
              {
                step: "02",
                title: "Set Permissions",
                desc: "Decide what data can be used for AI training. Deny, restrict, or set a price for access.",
                icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />
              },
              {
                step: "03",
                title: "Monitor & Earn",
                desc: "Watch real-time access logs and earn money when verified AI models use your approved data.",
                icon: <Activity className="w-6 h-6 text-emerald-400" />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-zinc-950 border-2 border-white/10 group-hover:border-emerald-500/50 flex items-center justify-center mb-8 relative z-10 transition-colors duration-500">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="font-display text-3xl font-bold text-zinc-500 group-hover:text-emerald-400 transition-colors duration-500">{item.step}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{item.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal / About Section */}
      <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-400 mb-6">
                <Code className="w-4 h-4" /> THE_PROBLEM.md
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">The AI Data Crisis</h2>
              <div className="space-y-6 text-lg text-zinc-400">
                <p>
                  Every day, billions of data points—your posts, photos, code, and emails—are scraped to train massive AI models without your explicit consent or compensation.
                </p>
                <p>
                  As regulations tighten and the threat of deepfakes grows, the internet needs a standardized way to handle data rights.
                </p>
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-100/80">
                  <strong className="text-emerald-400 block mb-2">The Solution:</strong>
                  ConsentOS is the infrastructure for the new data economy. We provide the technical and legal framework to ensure your data is only used exactly how you want it to be.
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              {/* Terminal Window */}
              <div className="rounded-2xl bg-[#0D0D0D] border border-white/10 overflow-hidden shadow-2xl">
                {/* Terminal Header */}
                <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="mx-auto text-xs font-mono text-zinc-500 flex items-center gap-2">
                    <Fingerprint className="w-3 h-3" /> consent-os-monitor.sh
                  </div>
                </div>
                
                {/* Terminal Body */}
                <div className="p-6 font-mono text-sm space-y-4 h-[400px] overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0D0D0D] z-10 pointer-events-none" />
                  
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: -100 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="space-y-4"
                  >
                    {[
                      { time: "10:23:01", log: "Intercepted request from ScraperBot_v2", action: "BLOCKED", color: "text-red-400" },
                      { time: "10:23:05", log: "Verifying smart contract 0x8f...3d2a", action: "VERIFIED", color: "text-emerald-400" },
                      { time: "10:23:06", log: "LLM_Training_Run accessing /public_tweets", action: "MONETIZED", color: "text-emerald-400", amount: "+$0.50" },
                      { time: "10:23:15", log: "Analytics_Engine requesting /profile_data", action: "RESTRICTED", color: "text-amber-400" },
                      { time: "10:23:22", log: "Intercepted request from Unknown_Crawler", action: "BLOCKED", color: "text-red-400" },
                      { time: "10:23:30", log: "Anthropic_Claude accessing /blog_posts", action: "MONETIZED", color: "text-emerald-400", amount: "+$1.20" },
                      { time: "10:23:45", log: "Midjourney requesting /instagram_photos", action: "DENIED", color: "text-red-400" },
                    ].map((line, i) => (
                      <div key={i} className="flex gap-4">
                        <span className="text-zinc-600 shrink-0">[{line.time}]</span>
                        <span className="text-zinc-300 flex-1">{line.log}</span>
                        <span className={`shrink-0 font-bold ${line.color}`}>
                          {line.action} {line.amount && <span className="text-emerald-300 ml-2">{line.amount}</span>}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 bg-zinc-900/30 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-20"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "How does ConsentOS actually enforce my permissions?",
                a: "We use Smart Consent Contracts (hashed on-chain). Developers and AI companies integrate our API to verify these contracts before accessing data. If they violate the terms, they lose access to our network and face legal compliance issues."
              },
              {
                q: "Can I really make money from my data?",
                a: "Yes. If you set your data to 'Monetized', AI labs that partner with ConsentOS will pay you directly (via fiat or stablecoin) when your data is used in their training runs."
              },
              {
                q: "Is ConsentOS free to use?",
                a: "The core features—tracking your footprint and setting basic permissions—are completely free. We offer premium tiers for advanced monetization analytics and enterprise mass-management."
              },
              {
                q: "What happens when I click 'Revoke All'?",
                a: "Our system instantly invalidates all active Smart Consent Contracts associated with your identity. Any compliant AI or app will immediately lose access to your data streams."
              }
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-white mb-4 flex items-start gap-4">
                  <span className="text-emerald-400 mt-1 group-hover:translate-x-1 transition-transform"><ChevronRight className="w-5 h-5" /></span>
                  {faq.q}
                </h3>
                <p className="text-zinc-400 pl-9 leading-relaxed text-lg">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-emerald-500/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-emerald-500/10 blur-[200px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-6 relative z-10 text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">Ready to own your data?</h2>
          <p className="text-xl text-emerald-100/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already protecting their digital identity and monetizing their content.
          </p>
          <Link href="/dashboard" className="group relative inline-flex items-center justify-center gap-3 bg-emerald-500 text-zinc-950 px-12 py-6 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(16,185,129,0.4)]">
            <span className="relative z-10 flex items-center gap-2">
              Initialize Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-emerald-400 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-white/5 pt-20 pb-10 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span className="font-display font-bold text-2xl tracking-tight text-white">ConsentOS</span>
              </div>
              <p className="text-zinc-400 max-w-sm leading-relaxed mb-8 text-lg">
                The standard infrastructure for personal data rights in the AI era. Protect, control, and monetize your digital footprint.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Platform</h4>
              <ul className="space-y-4 text-zinc-400">
                <li><Link href="#features" className="hover:text-emerald-400 transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">How it Works</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Developer API</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-6 text-lg">Company</h4>
              <ul className="space-y-4 text-zinc-400">
                <li><Link href="#about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500 font-mono">
            <p>© {new Date().getFullYear()} ConsentOS Inc. // All rights reserved.</p>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
