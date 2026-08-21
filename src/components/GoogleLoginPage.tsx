import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Radio,
  KeyRound,
  ArrowRight,
  User,
  Mail,
  Phone,
  Building2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface GoogleLoginPageProps {
  onSuccess?: () => void;
}

export const GoogleLoginPage: React.FC<GoogleLoginPageProps> = ({ onSuccess }) => {
  const {
    signInWithGoogle,
    developerCodes,
    authorizedDeveloperEmails
  } = useApp();

  // Mode: 'google_main' | 'custom_google_prompt' | 'staff_access_code'
  const [viewMode, setViewMode] = useState<'google_main' | 'custom_google_prompt' | 'staff_access_code'>('google_main');

  // Passenger Google Sign In States
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customPhone, setCustomPhone] = useState('+91 98220 12345');

  // Staff Access Code States (Compulsory verification)
  const [staffAccessCode, setStaffAccessCode] = useState('');
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffDepot, setStaffDepot] = useState('Pune Station');

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Quick Direct Google Sign In (e.g. Developer or Passenger)
  const handleQuickGoogleSignIn = (email: string, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const res = signInWithGoogle({
        name,
        email,
        phone: '+91 98810 99887'
      });

      setIsLoading(false);
      if (res.success && onSuccess) {
        onSuccess();
      }
    }, 400);
  };

  // Custom Passenger Google Sign In
  const handleCustomPassengerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customName.trim()) {
      setErrorMessage('Please enter both your name and Google email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const res = signInWithGoogle({
        name: customName.trim(),
        email: customEmail.trim(),
        phone: customPhone.trim()
      });

      setIsLoading(false);
      if (res.success && onSuccess) {
        onSuccess();
      }
    }, 400);
  };

  // Staff Access Code Verification Submission
  const handleStaffCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedCode = staffAccessCode.trim().toUpperCase();
    if (!trimmedCode) {
      setErrorMessage('Access code is compulsory for Admin Staff login.');
      return;
    }

    if (!staffName.trim() || !staffEmail.trim()) {
      setErrorMessage('Please enter your full name and official email address.');
      return;
    }

    // Check if code matches any active code in system
    const matchedCode = developerCodes.find(
      (c) => c.code.toUpperCase() === trimmedCode && c.isActive
    );

    const isPreAuthDev = authorizedDeveloperEmails.some(
      (devEmail) => devEmail.toLowerCase() === staffEmail.trim().toLowerCase()
    );

    if (!matchedCode && !isPreAuthDev) {
      setErrorMessage(
        'Access Code does not match our records or has been deactivated. Please re-enter a valid staff code or return to Google sign in.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = signInWithGoogle({
        name: staffName.trim(),
        email: staffEmail.trim(),
        phone: staffPhone.trim() || '+91 98230 44321',
        accessCode: trimmedCode
      });

      setIsLoading(false);

      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setErrorMessage(res.message || 'Access verification failed.');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200 p-4 sm:p-6 font-sans">
      
      {/* Background Ambience Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-amber-500/10 via-orange-600/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute -bottom-40 right-1/4 w-[400px] h-[300px] bg-purple-600/5 blur-3xl rounded-full" />
      </div>

      {/* Top Branding Section */}
      <header className="relative z-10 max-w-md mx-auto w-full text-center pt-4 sm:pt-8 pb-4">
        <div className="flex flex-col items-center">
          {/* Glowing App Icon Shield */}
          <div className="relative mb-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-lg" />
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-xl shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b1120] rounded-[14px] flex items-center justify-center">
                <span className="text-amber-400 font-black text-2xl tracking-tighter">M</span>
                <Radio className="w-4 h-4 text-amber-300 ml-0.5 animate-pulse" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-1.5 justify-center">
            <span>MahaFlow</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xs sm:max-w-sm mt-1.5 leading-relaxed font-normal">
            Run your transit networks, schedules, crowd updates and depot operations from one place.
          </p>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 max-w-md mx-auto w-full my-auto">
        <div className="bg-[#0b1222]/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          
          {/* ===================== 1. MAIN GOOGLE SIGN IN VIEW ===================== */}
          {viewMode === 'google_main' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Card Header */}
              <div className="text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Sign in to continue
                </h2>
                <p className="text-xs text-slate-400">
                  Your MahaFlow records are saved to your Google account.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Big Primary Google Button */}
              <button
                id="btn-google-continue"
                type="button"
                onClick={() => setViewMode('custom_google_prompt')}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg shadow-white/5 transition-all flex items-center justify-center gap-3 active:scale-[0.99] border border-slate-200"
              >
                {/* Google Multi-color G Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 text-slate-500 ml-auto" />
              </button>

              {/* Developer / Authorized One-Click Login Row */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>Authorized Root Accounts:</span>
                  <span className="text-[10px] text-amber-400 font-mono">Developer Mode</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickGoogleSignIn('visionx2425@gmail.com', 'VisionX Developer')}
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-purple-500/30 hover:border-purple-500/60 transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-xs font-bold font-mono">
                        VX
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-purple-300">
                          visionx2425@gmail.com
                        </div>
                        <div className="text-[10px] text-slate-400">System Developer (Root Access)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickGoogleSignIn('venomx2424@gmail.com', 'VenomX Developer')}
                    className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-purple-500/30 hover:border-purple-500/60 transition-all text-left flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center text-xs font-bold font-mono">
                        VX
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-purple-300">
                          venomx2424@gmail.com
                        </div>
                        <div className="text-[10px] text-slate-400">System Developer (Root Access)</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>

              {/* Small "Have access code?" Option */}
              <div className="pt-2 text-center">
                <button
                  id="btn-have-access-code"
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setViewMode('staff_access_code');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4 hover:no-underline transition-colors flex items-center justify-center gap-1.5 mx-auto"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Have access code? Admin Staff Portal</span>
                </button>
              </div>

            </div>
          )}

          {/* ===================== 2. CUSTOM PASSENGER GOOGLE SIGN IN MODAL/VIEW ===================== */}
          {viewMode === 'custom_google_prompt' && (
            <form onSubmit={handleCustomPassengerSubmit} className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setViewMode('google_main');
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Google Account Details
                </h3>
                <div className="w-10" />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Your Full Name *</span>
                </label>
                <input
                  required
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Rahul Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Email Address *</span>
                </label>
                <input
                  required
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. rahul.deshmukh@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Note: Logging in with venomx2424@gmail.com or visionx2425@gmail.com will automatically activate Root Developer console.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Sign In as Passenger</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ===================== 3. STAFF / ADMIN ACCESS CODE VIEW ===================== */}
          {viewMode === 'staff_access_code' && (
            <form onSubmit={handleStaffCodeSubmit} className="space-y-4 animate-in fade-in duration-200">
              
              {/* Header */}
              <div className="text-center space-y-1 pb-1">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div className="inline-block px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Admin Staff & Operator Login
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Join as Admin Staff
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your official station or depot access code. You will access the operational management workspace after joining.
                </p>
              </div>

              {/* Error Message Box */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                  <div className="pt-1 flex items-center justify-between border-t border-rose-500/20 text-[11px]">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMessage(null);
                        setViewMode('google_main');
                      }}
                      className="text-rose-200 underline hover:text-white font-bold"
                    >
                      ← Back to Google sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStaffAccessCode('');
                        setErrorMessage(null);
                      }}
                      className="text-slate-300 hover:text-white"
                    >
                      Retry Code
                    </button>
                  </div>
                </div>
              )}

              {/* 1. Compulsory Developer / Staff Access Code */}
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    Access Code / Developer Code *
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">Compulsory</span>
                </label>
                <input
                  required
                  type="text"
                  value={staffAccessCode}
                  onChange={(e) => setStaffAccessCode(e.target.value)}
                  placeholder="e.g. STAFF-PUNE-108 or MAHA-ADMIN-2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-300 text-sm font-mono font-bold placeholder:text-slate-600 focus:outline-none focus:border-amber-400 shadow-inner uppercase"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  <span className="text-[10px] text-slate-500">Quick valid keys:</span>
                  <button
                    type="button"
                    onClick={() => setStaffAccessCode('STAFF-PUNE-108')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/50"
                  >
                    STAFF-PUNE-108
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffAccessCode('MAHA-ADMIN-2025')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/50"
                  >
                    MAHA-ADMIN-2025
                  </button>
                  <button
                    type="button"
                    onClick={() => setStaffAccessCode('ADMIN-HQ-2026')}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:border-amber-500/50"
                  >
                    ADMIN-HQ-2026
                  </button>
                </div>
              </div>

              {/* 2. Staff Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  required
                  type="text"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. Ramesh K. Shinde"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 3. Official Google Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Google / Official Email *</span>
                </label>
                <input
                  required
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. ramesh.shinde@msrtc.gov.in"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* 4. Phone & Station Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Mobile Phone</label>
                  <input
                    type="tel"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    placeholder="+91 98220 11234"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Station / Depot</label>
                  <input
                    type="text"
                    value={staffDepot}
                    onChange={(e) => setStaffDepot(e.target.value)}
                    placeholder="Swargate / Pune"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Join Button */}
              <button
                id="btn-join-admin-staff"
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.99]"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Join Admin Staff Workspace</span>
                  </>
                )}
              </button>

              {/* Back to Google Sign In & Switch Account Options */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setViewMode('google_main');
                  }}
                  className="text-slate-400 hover:text-white flex items-center gap-1 underline underline-offset-4"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Google sign in</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStaffAccessCode('');
                    setStaffName('');
                    setStaffEmail('');
                    setErrorMessage(null);
                    setViewMode('google_main');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  Switch Account
                </button>
              </div>

            </form>
          )}

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 max-w-md mx-auto w-full text-center pt-6 pb-2">
        <div className="text-[11px] font-mono text-slate-400 tracking-wider uppercase flex items-center justify-center gap-2">
          <span>RUGGED</span>
          <span>•</span>
          <span>TRUSTED</span>
          <span>•</span>
          <span>FIELD READY</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">
          &copy; 2026 MahaFlow • Maharashtra State Transport Crowd Management
        </p>
      </footer>

    </div>
  );
};
