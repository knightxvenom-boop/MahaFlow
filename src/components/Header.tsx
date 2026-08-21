import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Sliders,
  User,
  LogOut,
  Smartphone,
  Monitor,
  RefreshCw,
  Clock,
  Radio,
  Bus,
  Train,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  activeTab: 'passenger' | 'map' | 'admin_staff' | 'developer';
  setActiveTab: (tab: 'passenger' | 'map' | 'admin_staff' | 'developer') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    developerSettings,
    setIsAuthModalOpen,
    logout,
    previewDeviceMode,
    setPreviewDeviceMode,
    triggerExternalScheduleSync
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    triggerExternalScheduleSync('ALL');
    setTimeout(() => setIsSyncing(false), 800);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'developer':
        return { label: 'System Developer', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
      case 'staff':
        return { label: 'Admin Staff', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      default:
        return { label: 'Passenger', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      {/* Maintenance Notification Bar if active */}
      {developerSettings.isMaintenanceMode && (
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-1 text-center text-xs font-medium text-amber-300 flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>System is currently in MAINTENANCE MODE</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          
          {/* Logo & App Branding */}
          <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => setActiveTab('passenger')}>
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-600 shadow-md shadow-orange-500/20 overflow-hidden shrink-0">
              {developerSettings.appLogoUrl ? (
                <img
                  src={developerSettings.appLogoUrl}
                  alt={developerSettings.appName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="flex items-center justify-center text-white font-black text-xl tracking-tight">
                  <span className="text-amber-100">M</span>
                  <Radio className="w-4 h-4 text-white animate-pulse -ml-0.5" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1">
                  {developerSettings.appName || 'MahaFlow'}
                </h1>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase tracking-wide">
                  MH Transit
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Crowd Intelligence & Live MSRTC / Railway Stream
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Strictly Role-Based: Passengers only see public tabs) */}
          <nav className="flex items-center gap-1 p-1 bg-slate-950/70 border border-slate-800/80 rounded-xl overflow-x-auto">
            {/* Public Tab 1: Live Transit */}
            <button
              id="nav-passenger"
              onClick={() => setActiveTab('passenger')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'passenger'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Bus className="w-3.5 h-3.5" />
              <span>Live Transit</span>
            </button>

            {/* Public Tab 2: Live GPS Map */}
            <button
              id="nav-map"
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              <span>Live GPS Map</span>
            </button>

            {/* Admin Staff Tab (Visible ONLY to Staff and Developer) */}
            {(currentUser.role === 'staff' || currentUser.role === 'developer') && (
              <button
                id="nav-admin-staff"
                onClick={() => setActiveTab('admin_staff')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'admin_staff'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Staff</span>
              </button>
            )}

            {/* Developer Tab (Visible ONLY to Developer) */}
            {currentUser.role === 'developer' && (
              <button
                id="nav-developer"
                onClick={() => setActiveTab('developer')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'developer'
                    ? 'bg-purple-500 text-white shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Dev Console</span>
              </button>
            )}
          </nav>

          {/* Right Controls: Device Preview Toggle, Timetable Sync, Google Profile & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Sync Schedule Button */}
            <button
              onClick={handleManualSync}
              title="Poll latest IRCTC / MSRTC Timetable Updates"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-all ${
                isSyncing ? 'text-amber-400 border-amber-500/50 animate-pulse' : ''
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync Timetables</span>
            </button>

            {/* Device View Mode Switcher */}
            <div className="hidden lg:flex items-center bg-slate-950/80 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => setPreviewDeviceMode('auto')}
                title="Adaptive Fluid Responsive"
                className={`p-1.5 rounded text-xs font-medium ${
                  previewDeviceMode === 'auto' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Auto
              </button>
              <button
                onClick={() => setPreviewDeviceMode('mobile')}
                title="Mobile View Frame (390px)"
                className={`p-1.5 rounded text-xs ${
                  previewDeviceMode === 'mobile' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDeviceMode('desktop')}
                title="Desktop View Frame"
                className={`p-1.5 rounded text-xs ${
                  previewDeviceMode === 'desktop' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Info & Logout Action */}
            <div className="flex items-center gap-2">
              <div
                id="header-user-btn"
                className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-left"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden border border-white/20">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0) || 'U'
                  )}
                </div>
                <div className="hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1">
                    <span className="truncate max-w-[90px]">{currentUser.name.split(' ')[0] || 'User'}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-1 rounded border ${roleInfo.color}`}>
                    {roleInfo.label}
                  </span>
                </div>
              </div>

              {/* Working Logout Option */}
              <button
                id="btn-logout"
                onClick={logout}
                title="Sign Out to Google Login Screen"
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-rose-300 bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 rounded-xl transition-all"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
