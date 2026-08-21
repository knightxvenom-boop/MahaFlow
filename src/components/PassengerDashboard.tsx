import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Search,
  Users,
  Bus,
  Train,
  Clock,
  AlertTriangle,
  Radio,
  Share2,
  Bell,
  ChevronRight,
  Info,
  Layers,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { BusScheduleView } from './BusScheduleView';
import { TrainScheduleView } from './TrainScheduleView';
import { CrowdPredictor } from './CrowdPredictor';
import { CrowdLevel } from '../types';

interface PassengerDashboardProps {
  onOpenMap: () => void;
}

export const PassengerDashboard: React.FC<PassengerDashboardProps> = ({ onOpenMap }) => {
  const { locations, selectedLocationId, setSelectedLocationId, selectedLocation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'buses' | 'trains' | 'prediction'>('buses');
  const [minutesAgo, setMinutesAgo] = useState(2);

  // Filter locations by search
  const filteredLocations = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (loc.marathiName && loc.marathiName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Compute live elapsed time for "Last updated X minutes ago"
  useEffect(() => {
    const updateMinutes = () => {
      if (selectedLocation?.lastUpdatedTime) {
        const diffMs = Date.now() - new Date(selectedLocation.lastUpdatedTime).getTime();
        const mins = Math.max(1, Math.floor(diffMs / 60000));
        setMinutesAgo(mins);
      }
    };
    updateMinutes();
    const timer = setInterval(updateMinutes, 30000);
    return () => clearInterval(timer);
  }, [selectedLocation]);

  const getCrowdVisuals = (level: CrowdLevel) => {
    switch (level) {
      case 'VERY_HIGH':
        return {
          bg: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
          badge: 'bg-rose-500 text-white font-extrabold shadow-rose-500/50 shadow-md',
          title: 'VERY HIGH CROWD',
          desc: 'Severe passenger congestion. Platforms operating beyond rated design capacity. Boarding delays expected.',
          isOvercrowded: true
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500/15 border-orange-500/40 text-orange-400',
          badge: 'bg-orange-500 text-slate-950 font-bold',
          title: 'HIGH CROWD',
          desc: 'High commuter volume. Moderate boarding queues at ticket gates and bay platforms.',
          isOvercrowded: true
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
          badge: 'bg-amber-500 text-slate-950 font-bold',
          title: 'MODERATE CROWD',
          desc: 'Steady passenger flow. Adequate capacity and regular turnaround intervals.',
          isOvercrowded: false
        };
      default:
        return {
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
          badge: 'bg-emerald-500 text-slate-950 font-bold',
          title: 'LOW CROWD',
          desc: 'Minimal congestion. Fast ticketing and comfortable platform circulation.',
          isOvercrowded: false
        };
    }
  };

  const crowdVisuals = getCrowdVisuals(selectedLocation.crowdLevel);

  const getProvenanceBadge = (prov: string) => {
    switch (prov) {
      case 'LIVE_API':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            LIVE API
          </span>
        );
      case 'STAFF_UPDATED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            STAFF UPDATED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Radio className="w-3 h-3 text-emerald-400" />
            LIVE AIS 140 / IRCTC
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Location Selector & Search Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5" /> Maharashtra Transit Hub Selector
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{selectedLocation.name}</span>
            </h2>
            {selectedLocation.marathiName && (
              <p className="text-xs text-slate-400">{selectedLocation.marathiName} • {selectedLocation.division}</p>
            )}
          </div>

          {/* Quick Hub Switch Dropdown & Live Map trigger */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-72">
              <select
                id="location-dropdown-select"
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id} className="bg-slate-900 text-white">
                    {loc.name} ({loc.city}) - {loc.crowdLevel}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold">
                ▼
              </div>
            </div>

            <button
              onClick={onOpenMap}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md shrink-0"
            >
              <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
              <span className="hidden sm:inline">Live Map</span>
            </button>
          </div>
        </div>

        {/* Quick City Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold text-[11px] whitespace-nowrap">Popular Hubs:</span>
          {locations.slice(0, 6).map((loc) => (
            <button
              key={loc.id}
              onClick={() => setSelectedLocationId(loc.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                loc.id === selectedLocationId
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{loc.city}: {loc.name.split(' ')[0]}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  loc.crowdLevel === 'VERY_HIGH'
                    ? 'bg-rose-500'
                    : loc.crowdLevel === 'HIGH'
                    ? 'bg-orange-500'
                    : loc.crowdLevel === 'MODERATE'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 2. Overcrowding Warning Banner if applicable */}
      {crowdVisuals.isOvercrowded && (
        <div
          id="overcrowding-warning-banner"
          className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 flex items-start gap-3 shadow-lg animate-in fade-in"
        >
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="flex-1 text-xs sm:text-sm">
            <div className="font-extrabold text-rose-200 flex items-center gap-2">
              <span>⚠️ OVERCROWDING ADVISORY FOR {selectedLocation.name.toUpperCase()}</span>
            </div>
            <p className="mt-1 text-rose-300 leading-relaxed">
              Crowd Index stands at <strong>{selectedLocation.crowdIndex}%</strong> of maximum passenger throughput.
              {selectedLocation.manualOverrideReason && (
                <span className="block mt-1 text-amber-200 font-medium">
                  <strong>Ground Reason:</strong> {selectedLocation.manualOverrideReason}
                </span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* 3. Main Crowd Index & Station Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Crowd Level & Formula Card */}
        <div className={`p-5 rounded-2xl border shadow-xl flex flex-col justify-between ${crowdVisuals.bg}`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Live Crowd Status
              </span>
              {getProvenanceBadge(selectedLocation.provenance)}
            </div>

            <div className="flex items-baseline gap-3 my-2">
              <div className={`px-3 py-1 rounded-xl text-xs uppercase tracking-wide ${crowdVisuals.badge}`}>
                {crowdVisuals.title}
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {selectedLocation.crowdIndex}%
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {crowdVisuals.desc}
            </p>
          </div>

          {/* Mathematical Crowd Formula Breakdown */}
          <div className="pt-3 border-t border-white/10 bg-slate-950/40 p-3 rounded-xl">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold mb-1 flex items-center justify-between">
              <span>Crowd Index Formula</span>
              <span className="text-amber-400 font-bold">Demand / Capacity × 100</span>
            </div>
            <div className="text-xs font-mono text-slate-200">
              <span className="text-amber-300 font-bold">{selectedLocation.currentEstimatedDemand}</span> Demand /{' '}
              <span className="text-blue-300 font-bold">{selectedLocation.capacityPerHr}</span> Capacity/hr ={' '}
              <strong className="text-white font-bold">{selectedLocation.crowdIndex}%</strong>
            </div>
          </div>
        </div>

        {/* Transport Availability & Waiting Time */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" /> Transport Availability
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {selectedLocation.platformBaysCount} Platforms / Bays
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                  <Bus className="w-3.5 h-3.5" />
                  <span>Available Buses</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {selectedLocation.currentBusesAvailable}
                </div>
                <span className="text-[10px] text-slate-500">MSRTC & City Feeders</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
                  <Train className="w-3.5 h-3.5" />
                  <span>Available Trains</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {selectedLocation.currentTrainsAvailable}
                </div>
                <span className="text-[10px] text-slate-500">CR / WR / Suburban</span>
              </div>
            </div>
          </div>

          {/* Wait Time Bar */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Wait Time</span>
                <span className="text-sm font-black text-white">{selectedLocation.estimatedWaitTimeMin} Minutes</span>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              Status: {selectedLocation.serviceStatus}
            </span>
          </div>
        </div>

        {/* Verification & Station Audit Meta */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Data Provenance
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">VERIFIED</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Last Field Update</span>
                <span className="font-bold text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Last updated {minutesAgo} minute{minutesAgo === 1 ? '' : 's'} ago
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Updated By Source</span>
                <span className="font-semibold text-slate-200 truncate block mt-0.5">
                  {selectedLocation.updatedBy}
                </span>
              </div>
            </div>
          </div>

          {/* Nearby Stations List */}
          {selectedLocation.nearbyStationIds && selectedLocation.nearbyStationIds.length > 0 && (
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                Nearby Transit Nodes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedLocation.nearbyStationIds.map((nId) => {
                  const nearbyObj = locations.find((l) => l.id === nId);
                  if (!nearbyObj) return null;
                  return (
                    <button
                      key={nId}
                      onClick={() => setSelectedLocationId(nId)}
                      className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>{nearbyObj.name.split(' ')[0]}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 4. Active Announcements Ticker */}
      {selectedLocation.activeAnnouncements && selectedLocation.activeAnnouncements.length > 0 && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-start gap-3 shadow-md">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Bell className="w-4 h-4 animate-ring" />
          </div>
          <div className="space-y-1 text-xs">
            <span className="font-bold text-amber-300 uppercase tracking-wide text-[10px]">
              Official Station Broadcast:
            </span>
            {selectedLocation.activeAnnouncements.map((ann, idx) => (
              <p key={idx} className="text-slate-200 font-medium leading-relaxed">
                • {ann}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 5. Sub-Tabs: Buses, Trains & Future Prediction */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              id="tab-buses-btn"
              onClick={() => setActiveSubTab('buses')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'buses'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bus className="w-4 h-4" />
              <span>MSRTC Bus Schedules</span>
            </button>

            <button
              id="tab-trains-btn"
              onClick={() => setActiveSubTab('trains')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'trains'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Train className="w-4 h-4" />
              <span>Railways / Local Trains</span>
            </button>

            <button
              id="tab-prediction-btn"
              onClick={() => setActiveSubTab('prediction')}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'prediction'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Crowd AI Prediction</span>
            </button>
          </div>
        </div>

        {/* Content of selected sub-tab */}
        {activeSubTab === 'buses' && <BusScheduleView />}
        {activeSubTab === 'trains' && <TrainScheduleView />}
        {activeSubTab === 'prediction' && <CrowdPredictor />}
      </div>

    </div>
  );
};
