import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sliders,
  Wrench,
  KeyRound,
  PlusCircle,
  Users,
  Image as ImageIcon,
  RefreshCw,
  Radio,
  Sparkles,
  ShieldCheck,
  Power,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  Trash2,
  Copy,
  Activity,
  Terminal,
  Server
} from 'lucide-react';
import { UserRole } from '../types';

export const DeveloperDashboard: React.FC = () => {
  const {
    currentUser,
    developerSettings,
    updateDeveloperSettings,
    developerCodes,
    generateNewAccessCode,
    toggleCodeActive,
    triggerExternalScheduleSync,
    externalSyncLogs,
    authorizedDeveloperEmails
  } = useApp();

  // Local states for settings form
  const [appName, setAppName] = useState(developerSettings.appName);
  const [appLogoUrl, setAppLogoUrl] = useState(developerSettings.appLogoUrl);
  const [maintenanceReason, setMaintenanceReason] = useState(developerSettings.maintenanceReason);
  
  // Access code generator state
  const [codeRole, setCodeRole] = useState<UserRole>('staff');
  const [codeDesc, setCodeDesc] = useState('');
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeveloperSettings({
      appName,
      appLogoUrl,
      maintenanceReason
    });
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2500);
  };

  const handleGenerateCode = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = generateNewAccessCode(codeRole, codeDesc || `${codeRole === 'staff' ? 'ADMIN STAFF' : codeRole.toUpperCase()} Privilege Key`);
    setLastGeneratedCode(newCode.code);
    setCodeDesc('');
  };

  const handleCopyCode = (codeStr: string, id: string) => {
    navigator.clipboard.writeText(codeStr);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" /> System Architect Console
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase font-bold">
              ROOT ACCESS
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Developer Infrastructure & Security Console
          </h2>
          <p className="text-xs text-slate-300">
            Control branding, security access elevation codes, system maintenance status & live telemetry bridges
          </p>
        </div>

        {/* Maintenance Mode Big Toggle */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-purple-500/30 flex items-center gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Maintenance State</span>
            <span className={`text-xs font-bold ${developerSettings.isMaintenanceMode ? 'text-rose-400' : 'text-emerald-400'}`}>
              {developerSettings.isMaintenanceMode ? 'ACTIVE (APP LOCKED)' : 'ONLINE (NORMAL)'}
            </span>
          </div>
          <button
            id="btn-toggle-maintenance"
            onClick={() => updateDeveloperSettings({ isMaintenanceMode: !developerSettings.isMaintenanceMode })}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              developerSettings.isMaintenanceMode
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{developerSettings.isMaintenanceMode ? 'Disable Maint.' : 'Enable Maint.'}</span>
          </button>
        </div>
      </div>

      {savedSettingsNotice && (
        <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-purple-400" />
          <span>Branding and developer configurations applied instantly!</span>
        </div>
      )}

      {/* Authorized Developer Accounts Panel */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 via-purple-950/30 to-slate-900/95 border border-purple-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Authorized Root Developer Accounts
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  2 Active Keys
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Pre-authorized accounts with automatic Root privileges, bypass rules, and full console control
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-purple-300/80 bg-purple-500/10 px-3 py-1 rounded-lg border border-purple-500/20">
            Current Session: <strong className="text-white font-bold">{currentUser.email}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* venomx2424@gmail.com */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/20">
                VX
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">VenomX Developer</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                    Root Developer
                  </span>
                </div>
                <div className="text-xs font-mono text-purple-300 mt-0.5">venomx2424@gmail.com</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Full Console Access • Bypass Auth • State Override</span>
                </div>
              </div>
            </div>
            {currentUser.email.toLowerCase() === 'venomx2424@gmail.com' && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-500/30 whitespace-nowrap">
                You (Active)
              </span>
            )}
          </div>

          {/* visionx2425@gmail.com */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-purple-500/30 flex items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/20">
                VS
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">VisionX Developer</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                    Root Developer
                  </span>
                </div>
                <div className="text-xs font-mono text-purple-300 mt-0.5">visionx2425@gmail.com</div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Full Console Access • Bypass Auth • State Override</span>
                </div>
              </div>
            </div>
            {currentUser.email.toLowerCase() === 'visionx2425@gmail.com' && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-500/30 whitespace-nowrap">
                You (Active)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Branding + Access Code Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. App Branding & Customization Settings */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              App Name & Branding Customizer
            </h3>
          </div>

          <form onSubmit={handleSaveBranding} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Application Name</label>
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. MahaFlow"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm font-bold focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Custom Logo URL (Image URL)</label>
              <input
                type="url"
                value={appLogoUrl}
                onChange={(e) => setAppLogoUrl(e.target.value)}
                placeholder="https://example.com/custom-logo.png (leave blank for default badge)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Maintenance Notice Message</label>
              <textarea
                rows={3}
                value={maintenanceReason}
                onChange={(e) => setMaintenanceReason(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Branding Changes</span>
            </button>
          </form>
        </div>

        {/* 2. Admin & Staff Access Code Generator */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Generate Admin / Staff Passcode
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Auto-Encrypted</span>
          </div>

          <form onSubmit={handleGenerateCode} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Role Privilege</label>
                <select
                  value={codeRole}
                  onChange={(e) => setCodeRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                >
                  <option value="staff">Admin Staff (Operations & Depot Registry)</option>
                  <option value="developer">Full Developer (Root Access)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Purpose / Division</label>
                <input
                  type="text"
                  value={codeDesc}
                  onChange={(e) => setCodeDesc(e.target.value)}
                  placeholder="e.g. Pune Division Head"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-colors flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Generate Dynamic Access Code</span>
            </button>

            {lastGeneratedCode && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between animate-in fade-in">
                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">New Access Key Generated:</span>
                  <span className="text-base font-mono font-black text-white">{lastGeneratedCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyCode(lastGeneratedCode, 'last-gen')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCodeId === 'last-gen' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            )}
          </form>

          <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <strong>Persistent Elevation Rule:</strong> When an Admin signs in using an access code, updating or deactivating the code in the future will <strong>NOT</strong> log them out. Their authorized session remains active.
          </p>
        </div>

      </div>

      {/* 3. Active Access Codes & Redeemed Users Audit Table */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Access Codes & Redeemed Admins Audit Log
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{developerCodes.length} Codes Configured</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {developerCodes.map((codeObj) => (
            <div
              key={codeObj.id}
              className={`p-4 rounded-xl border flex flex-col justify-between ${
                codeObj.isActive ? 'bg-slate-950/90 border-slate-800' : 'bg-slate-950/40 border-slate-900 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-amber-400 tracking-wider">
                    {codeObj.code}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      codeObj.roleToGrant === 'developer'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {codeObj.roleToGrant === 'staff' ? 'ADMIN STAFF' : codeObj.roleToGrant}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3">{codeObj.description}</p>

                {/* Redeemed By List */}
                <div className="space-y-1.5 text-xs mb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">
                    Redeemed Users ({codeObj.redeemedCount}):
                  </span>
                  {codeObj.redeemedBy.length > 0 ? (
                    codeObj.redeemedBy.map((user, idx) => (
                      <div key={idx} className="p-1.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                        <strong className="text-white">{user.name}</strong> • {user.phone}
                        <div className="text-[9px] text-slate-500 font-mono">{user.email}</div>
                      </div>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-600 italic">No users have redeemed this code yet</span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleCopyCode(codeObj.code, codeObj.id)}
                  className="text-slate-400 hover:text-amber-400 font-mono text-[11px] flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCodeId === codeObj.id ? 'Copied' : 'Copy Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleCodeActive(codeObj.id)}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    codeObj.isActive
                      ? 'text-rose-400 hover:bg-rose-500/10'
                      : 'text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                >
                  {codeObj.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. External IRCTC / MSRTC Timetable Synchronizer & Webhook Simulator */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              External IRCTC / MSRTC Schedule Sync Engine
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => triggerExternalScheduleSync('MSRTC')}
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold hover:bg-amber-500/30 transition-colors"
            >
              Simulate MSRTC Change
            </button>
            <button
              onClick={() => triggerExternalScheduleSync('IRCTC')}
              className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold hover:bg-blue-500/30 transition-colors"
            >
              Simulate Railway Change
            </button>
          </div>
        </div>

        {/* Live Terminal Log */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
          <div className="text-[11px] text-slate-500 flex items-center gap-1 pb-1 border-b border-slate-900">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Webhook Listener & NTES / AIS 140 Stream Terminal</span>
          </div>
          {externalSyncLogs.map((log, idx) => (
            <div key={idx} className="leading-relaxed">
              <span className="text-emerald-400">&gt; </span>
              {log}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
