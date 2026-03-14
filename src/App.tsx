/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Upload, 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Eye, 
  Volume2, 
  Info,
  ArrowRight,
  Youtube,
  Smartphone,
  CreditCard,
  Star,
  ShieldCheck,
  X
} from 'lucide-react';
import { generateHooks, Hook } from './services/geminiService';

const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['3 Generations / day', 'Basic Hooks', 'Standard Support'],
    buttonText: 'Current Plan',
    highlight: false
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: '$19',
    period: '/mo',
    description: 'For serious content creators',
    features: ['Unlimited Generations', 'Viral Hashtags', 'Priority AI Models', 'Priority Support'],
    buttonText: 'Upgrade to Pro',
    highlight: true,
    amount: 19,
    planCode: 'PLN_monthly_123' // Placeholder - user must replace with real Paystack Plan Code
  },
  {
    id: 'pro_yearly',
    name: 'Pro Yearly',
    price: '$159',
    period: '/yr',
    description: 'Best value for professionals',
    features: ['Everything in Pro', 'Save 30%', 'Early Access to Features'],
    buttonText: 'Go Yearly',
    highlight: false,
    amount: 159,
    planCode: 'PLN_yearly_456' // Placeholder - user must replace with real Paystack Plan Code
  }
];

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [showPricing, setShowPricing] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check for success session ID in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      alert('Subscription successful! Welcome to Pro.');
      window.history.replaceState({}, document.title, "/");
    }
  }, []);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await generateHooks(input);
      setHooks(result.hooks);
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: any) => {
    if (!plan.planCode) return;
    
    setCheckoutLoading(plan.id);
    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: 'emilseyhaizel32@gmail.com', // Using user's email
          amount: plan.amount,
          plan: plan.planCode 
        }),
      });

      const data = await response.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error(data.error || 'Failed to initialize Paystack transaction');
      }
    } catch (err: any) {
      const errorMessage = err instanceof Error ? err.message : 'Payment error';
      alert(`Payment Error: ${errorMessage}`);
      console.error('Detailed Payment Error:', err);
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-neon-purple/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center shadow-lg shadow-neon-purple/20">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">HookGen <span className="text-neon-purple">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowPricing(true)}
              className="text-sm font-bold text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-yellow-500" />
              Pricing
            </button>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-4 text-xs font-medium text-zinc-500 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Youtube className="w-3 h-3" /> Shorts</span>
              <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> TikTok</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-6xl font-display font-bold mb-6 tracking-tight">
              Stop the Scroll with <br />
              <span className="gradient-text">Viral Hooks</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              Paste your script or upload a transcript. Our AI generates 5 high-energy hooks designed to skyrocket your retention.
            </p>
          </motion.div>
        </div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6 sm:p-8 mb-12 shadow-2xl shadow-black/50"
        >
          <div className="flex flex-col gap-4">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your script or transcript here..."
                className="w-full h-48 bg-zinc-950/50 border border-white/10 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:border-neon-purple/50 transition-all resize-none font-mono text-sm"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors flex items-center gap-2 text-xs font-medium"
                  title="Upload Transcript"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload .txt</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".txt"
                  className="hidden"
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !input.trim()}
              className={`w-full py-4 rounded-xl font-display font-bold text-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${
                loading || !input.trim()
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-xl shadow-neon-purple/20 hover:shadow-neon-purple/40'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Analyzing Script...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate 5 Viral Hooks</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-red-300">Generation Failed</p>
                <p className="text-sm opacity-80">{error}</p>
              </div>
            </div>
            <button
              onClick={handleGenerate}
              className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all text-sm font-bold flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* Results Section */}
        <div id="results" className="space-y-8">
          <AnimatePresence mode="popLayout">
            {hooks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-6"
              >
                <h2 className="text-2xl font-display font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-neon-purple" />
                  Generated Hooks
                </h2>
                <span className="text-zinc-500 text-sm font-mono">5 OPTIONS READY</span>
              </motion.div>
            )}

            {hooks.map((hook, index) => (
              <motion.div
                key={hook.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden brutalist-border group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Number Badge */}
                  <div className="md:w-16 bg-zinc-800/50 flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
                    <span className="text-3xl font-display font-black text-zinc-700 group-hover:text-neon-purple transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="flex-1 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Visual Hook */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-neon-cyan font-display font-bold text-xs uppercase tracking-widest">
                          <Eye className="w-4 h-4" />
                          Visual Hook
                        </div>
                        <p className="text-zinc-200 leading-relaxed">
                          {hook.visual}
                        </p>
                      </div>

                      {/* Audio Hook */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-neon-pink font-display font-bold text-xs uppercase tracking-widest">
                          <Volume2 className="w-4 h-4" />
                          Audio Hook
                        </div>
                        <p className="text-zinc-200 leading-relaxed italic">
                          "{hook.audio}"
                        </p>
                      </div>
                    </div>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {hook.hashtags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono font-bold text-neon-purple bg-neon-purple/10 px-2 py-0.5 rounded-full border border-neon-purple/20">
                          #{tag.replace(/^#/, '')}
                        </span>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-2 text-zinc-400 text-sm">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-neon-purple" />
                        <p>{hook.explanation}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(`Visual: ${hook.visual}\nAudio: ${hook.audio}`, hook.id)}
                        className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-all text-xs font-bold uppercase tracking-wider"
                      >
                        {copiedId === hook.id ? (
                          <>
                            <Check className="w-4 h-4 text-green-400" />
                            <span className="text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Hook</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State / Tips */}
        {hooks.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            {[
              { title: "High Contrast", desc: "Start with a visual that breaks the pattern of the feed.", icon: Eye },
              { title: "Pattern Interrupt", desc: "Use audio that forces the viewer to pay attention.", icon: Volume2 },
              { title: "Curiosity Gap", desc: "Open with a question or a bold claim that needs context.", icon: Sparkles },
            ].map((tip, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/5 bg-zinc-900/30">
                <tip.icon className="w-6 h-6 text-zinc-600 mb-4" />
                <h3 className="font-display font-bold text-zinc-300 mb-2">{tip.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Pricing Modal */}
      <AnimatePresence>
        {showPricing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPricing(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 sm:p-12">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-2">Choose your plan</h2>
                    <p className="text-zinc-400">Unlock the full power of HookGen AI</p>
                  </div>
                  <button 
                    onClick={() => setShowPricing(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-zinc-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {PRICING_PLANS.map((plan) => (
                    <div 
                      key={plan.id}
                      className={`relative p-8 rounded-2xl border transition-all ${
                        plan.highlight 
                          ? 'bg-zinc-800/50 border-neon-purple shadow-xl shadow-neon-purple/10' 
                          : 'bg-zinc-950/50 border-white/5 hover:border-white/10'
                      }`}
                    >
                      {plan.highlight && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-purple text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                          Most Popular
                        </div>
                      )}
                      
                      <div className="mb-8">
                        <h3 className="text-xl font-display font-bold mb-1">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-4xl font-display font-bold">{plan.price}</span>
                          {plan.period && <span className="text-zinc-500 text-sm">{plan.period}</span>}
                        </div>
                        <p className="text-zinc-400 text-sm">{plan.description}</p>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-zinc-300">
                            <ShieldCheck className={`w-4 h-4 ${plan.highlight ? 'text-neon-purple' : 'text-zinc-600'}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => plan.planCode && handleSubscribe(plan)}
                        disabled={!plan.planCode || !!checkoutLoading}
                        className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                          plan.highlight
                            ? 'bg-neon-purple text-white hover:bg-neon-purple/90'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-50'
                        }`}
                      >
                        {checkoutLoading === plan.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            {plan.planCode && <CreditCard className="w-4 h-4" />}
                            {plan.buttonText}
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-600 text-sm mb-4">
            Powered by Gemini 3.1 Flash • Optimized for Short-Form Content
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-zinc-500 hover:text-neon-purple transition-colors"><Youtube className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-500 hover:text-neon-purple transition-colors"><Smartphone className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
