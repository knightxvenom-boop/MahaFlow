import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PassengerDashboard } from './components/PassengerDashboard';
import { LiveMap } from './components/LiveMap';
import { AdminStaffDashboard } from './components/AdminStaffDashboard';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { GoogleLoginPage } from './components/GoogleLoginPage';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import {
  ShieldAlert,
  Radio,
  Bus,
  Train,
  CheckCircle2,
  Info,
  Smartphone,
  Monitor
} from 'lucide-react';

const MainApp: React.FC = () => {
  const {
    currentUser,
    developerSettings,
    previewDeviceMode,
    setPreviewDeviceMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'passenger' | 'map' | 'admin_staff' | 'developer'>('passenger');

  // Reset tab to passenger if current user doesn't have permission for active tab
  useEffect(() => {
    if (activeTab === 'developer' && currentUser.role !== 'developer') {
      setActiveTab('passenger');
    }
    if (activeTab === 'admin_staff' && currentUser.role !== 'staff' && currentUser.role !== 'developer') {
      setActiveTab('passenger');
    }
  }, [currentUser.role, activeTab]);

  // 1. If not authenticated via Google, show the Google Login Page
  if (!currentUser.isGoogleAuthed) {
    return <GoogleLoginPage onSuccess={() => setActiveTab('passenger')} />;
  }

  // 2. If system is in maintenance mode and user is NOT a developer, show Maintenance Screen
  if (developerSettings.isMaintenanceMode && currentUser.role !== 'developer') {
    return <MaintenanceScreen />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'map':
        return <LiveMap onSelectLocation={() => setActiveTab('passenger')} />;
      case 'admin_staff':
        return <AdminStaffDashboard onOpenMap={() => setActiveTab('map')} />;
      case 'developer':
        return currentUser.role === 'developer' ? (
          <DeveloperDashboard />
        ) : (
          <PassengerDashboard onOpenMap={() => setActiveTab('map')} />
        );
      default:
        return <PassengerDashboard onOpenMap={() => setActiveTab('map')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Container with Device Frame Toggle Support */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5">
        
        {previewDeviceMode === 'mobile' ? (
          // Smartphone preview frame (390px Viewport)
          <div className="flex flex-col items-center justify-center my-2">
            <div className="text-xs text-amber-400 font-bold mb-2 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Interactive Mobile Screen View (390px Viewport)</span>
              <button
                onClick={() => setPreviewDeviceMode('auto')}
                className="ml-2 underline text-slate-400 hover:text-white"
              >
                Reset to Full Desktop
              </button>
            </div>
            
            <div className="w-[390px] max-w-full bg-slate-900 border-[8px] border-slate-800 rounded-[40px] shadow-2xl overflow-hidden min-h-[780px] flex flex-col relative">
              {/* Dynamic Island / Notch */}
              <div className="w-full bg-slate-950 pt-3 pb-2 px-6 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800">
                <span className="font-bold text-white">09:41</span>
                <div className="w-20 h-4 bg-slate-800 rounded-full" />
                <span>5G 100%</span>
              </div>

              {/* Mobile Content Scroller */}
              <div className="flex-1 p-3 overflow-y-auto max-h-[720px]">
                {renderContent()}
              </div>
            </div>
          </div>
        ) : (
          // Standard Fluid Responsive Layout
          <div className="animate-in fade-in duration-150">
            {renderContent()}
          </div>
        )}

      </main>

      {/* Provenance Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/60 py-5 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold text-white">MahaFlow Platform</span>
            <span className="text-slate-500">•</span>
            <span>Maharashtra Smart Public Transit Crowd Management</span>
          </div>

          {/* Provenance Explainer Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              🟢 LIVE API: AIS 140 / IRCTC NTES
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
              🔵 STAFF UPDATED: Ground Duty Officers
            </span>
          </div>

          <div className="text-slate-500 text-[11px]">
            &copy; 2026 Maharashtra State Transport Division
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
