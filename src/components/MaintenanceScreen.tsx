import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wrench, ShieldAlert, KeyRound, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const MaintenanceScreen: React.FC = () => {
  const { developerSettings, redeemAccessCode } = useApp();
  const [bypassCode, setBypassCode] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleBypass = (e: React.FormEvent) => {
    e.preventDefault();
    const result = redeemAccessCode(bypassCode.trim());
    if (result.success) {
      setFeedback('Elevated to Developer session. Bypassing maintenance window.');
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      setFeedback('Invalid developer master bypass code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10 text-center">
        {/* Animated Wrench / Maintenance Badge */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
          <Wrench className="w-10 h-10 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
          <ShieldAlert className="w-3.5 h-3.5" />
          System Maintenance in Progress
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
          {developerSettings.appName || 'MahaFlow'} is Upgrading
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-left">
          {developerSettings.maintenanceReason}
        </p>

        <div className="grid grid-cols-2 gap-3 text-left mb-6 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Targeted Services</span>
            <span className="font-semibold text-slate-200">MSRTC Telemetry & IRCTC Gateway</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Transit Status</span>
            <span className="font-semibold text-emerald-400">Buses & Trains Running Normally</span>
          </div>
        </div>

        {/* Developer Bypass Form */}
        <div className="pt-6 border-t border-slate-800">
          <form onSubmit={handleBypass} className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                Developer Bypass Key
              </span>
              <span className="font-mono text-[10px] text-slate-500">(e.g. DEV-MASTER-999)</span>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={bypassCode}
                onChange={(e) => setBypassCode(e.target.value.toUpperCase())}
                placeholder="DEV-MASTER-999"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-amber-300 font-mono text-xs tracking-wider focus:outline-none focus:border-amber-500 uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0"
              >
                <span>Bypass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {feedback && (
              <p className="text-xs text-amber-400 text-left flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {feedback}
              </p>
            )}
          </form>
        </div>

        <p className="text-[11px] text-slate-500 mt-6">
          Government of Maharashtra Public Transit Directorate &copy; 2026
        </p>
      </div>
    </div>
  );
};
