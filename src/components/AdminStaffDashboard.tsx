import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Save,
  CheckCircle2,
  AlertTriangle,
  Bus,
  Train,
  Clock,
  Volume2,
  Building2,
  Users,
  Radio,
  History,
  PlusCircle,
  Search,
  Filter,
  Activity,
  Layers,
  MapPin
} from 'lucide-react';
import { CrowdLevel, TransportLocation } from '../types';

interface AdminStaffDashboardProps {
  onOpenMap?: () => void;
}

export const AdminStaffDashboard: React.FC<AdminStaffDashboardProps> = ({ onOpenMap }) => {
  const {
    currentUser,
    locations,
    selectedLocationId,
    setSelectedLocationId,
    selectedLocation,
    updateCrowdByStaff,
    registerNewTransportLocation,
    staffLogs
  } = useApp();

  // Tab mode within Admin Staff: 'duty_desk' | 'node_registry' | 'audit_trail'
  const [activeSubTab, setActiveSubTab] = useState<'duty_desk' | 'node_registry' | 'audit_trail'>('duty_desk');

  // Duty Desk Form State
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>(selectedLocation.crowdLevel);
  const [overrideReason, setOverrideReason] = useState(
    selectedLocation.manualOverrideReason || 'Routine platform crowd observation & shift check'
  );
  const [busesAvailable, setBusesAvailable] = useState<number>(selectedLocation.currentBusesAvailable);
  const [trainsAvailable, setTrainsAvailable] = useState<number>(selectedLocation.currentTrainsAvailable);
  const [waitTimeMinutes, setWaitTimeMinutes] = useState<number>(selectedLocation.estimatedWaitTimeMin);
  const [announcement, setAnnouncement] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Depot Registration State
  const [showRegModal, setShowRegModal] = useState(false);
  const [regName, setRegName] = useState('');
  const [regMarathiName, setRegMarathiName] = useState('');
  const [regCity, setRegCity] = useState('Pune');
  const [regDistrict, setRegDistrict] = useState('Pune');
  const [regDivision, setRegDivision] = useState('MSRTC Pune Division');
  const [regType, setRegType] = useState<TransportLocation['type']>('BUS_STAND');
  const [regCapacity, setRegCapacity] = useState(1200);
  const [regInitialDemand, setRegInitialDemand] = useState(450);
  const [regLat, setRegLat] = useState('18.5204');
  const [regLng, setRegLng] = useState('73.8567');
  const [regSuccess, setRegSuccess] = useState(false);

  // Filter state for Registry
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'BUS_STAND' | 'RAILWAY_STATION' | 'INTERMODAL_HUB'>('ALL');

  // Sync state if user changes selected location
  const handleLocationChange = (locId: string) => {
    setSelectedLocationId(locId);
    const loc = locations.find((l) => l.id === locId);
    if (loc) {
      setCrowdLevel(loc.crowdLevel);
      setOverrideReason(loc.manualOverrideReason || '');
      setBusesAvailable(loc.currentBusesAvailable);
      setTrainsAvailable(loc.currentTrainsAvailable);
      setWaitTimeMinutes(loc.estimatedWaitTimeMin);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCrowdByStaff({
      locationId: selectedLocationId,
      crowdLevel,
      overrideReason,
      busesAvailable,
      trainsAvailable,
      waitTimeMinutes,
      announcement: announcement.trim() || undefined
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setAnnouncement('');
  };

  const handleRegisterNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    registerNewTransportLocation({
      name: regName.trim(),
      marathiName: regMarathiName.trim() || regName.trim(),
      city: regCity.trim(),
      district: regDistrict.trim(),
      division: regDivision.trim(),
      type: regType,
      platformBaysCount: 8,
      capacityPerHr: Number(regCapacity) || 1000,
      currentEstimatedDemand: Number(regInitialDemand) || 400,
      crowdLevel: 'LOW',
      coordinates: [parseFloat(regLat) || 18.5204, parseFloat(regLng) || 73.8567],
      nearbyStationIds: [],
      currentBusesAvailable: 15,
      currentTrainsAvailable: regType === 'BUS_STAND' ? 0 : 5,
      estimatedWaitTimeMin: 8,
      serviceStatus: 'NORMAL',
      activeAnnouncements: ['New official transit node provisioned and active on MahaFlow.']
    });

    setRegSuccess(true);
    setTimeout(() => {
      setRegSuccess(false);
      setShowRegModal(false);
      setRegName('');
      setRegMarathiName('');
    }, 1800);
  };

  // Filter logs for selected location
  const locationLogs = staffLogs.filter((log) => log.locationId === selectedLocationId);

  // Filter locations for registry view
  const filteredLocations = locations.filter((loc) => {
    const matchSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.division.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = filterType === 'ALL' || loc.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Admin Staff Workspace
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
              Staff ID: STAFF-{currentUser.phone.slice(-4) || '9921'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Official Crowd & Fleet Operations Desk
          </h2>
          <p className="text-xs text-slate-300">
            Duty Officer: <strong className="text-white">{currentUser.name}</strong> • Active Station:{' '}
            <strong className="text-emerald-300">{selectedLocation.name}</strong>
          </p>
        </div>

        {/* Sub-Navigation Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSubTab('duty_desk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'duty_desk'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Duty Desk
          </button>
          <button
            onClick={() => setActiveSubTab('node_registry')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'node_registry'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Depot Registry
          </button>
          <button
            onClick={() => setActiveSubTab('audit_trail')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'audit_trail'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trail
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <div className="text-xs sm:text-sm font-semibold">
            Status Published! Crowd level for <strong>{selectedLocation.name}</strong> updated to{' '}
            <span className="uppercase font-bold underline">{crowdLevel}</span>. Passengers updated instantly.
          </div>
        </div>
      )}

      {/* ======================= 1. DUTY DESK VIEW ======================= */}
      {activeSubTab === 'duty_desk' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Form (2 cols) */}
          <form onSubmit={handleFormSubmit} className="lg:col-span-2 space-y-5 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
            
            {/* Station Selector */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Target Station / Depot Assignment *
              </label>
              <select
                id="staff-location-select"
                value={selectedLocationId}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city} - {loc.division})
                  </option>
                ))}
              </select>
            </div>

            {/* 1. Crowd Level Radio Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>1. Official Crowd Level Classification *</span>
                <span className="text-slate-400 font-normal">Select observed passenger density</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                
                <button
                  type="button"
                  id="crowd-low-btn"
                  onClick={() => setCrowdLevel('LOW')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    crowdLevel === 'LOW'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-emerald-500/40'
                  }`}
                >
                  <span>LOW (0-50%)</span>
                  <span className="text-[10px] font-normal opacity-90">Normal Flow</span>
                </button>

                <button
                  type="button"
                  id="crowd-moderate-btn"
                  onClick={() => setCrowdLevel('MODERATE')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    crowdLevel === 'MODERATE'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  <span>MODERATE (51-80%)</span>
                  <span className="text-[10px] font-normal opacity-90">Steady Inflow</span>
                </button>

                <button
                  type="button"
                  id="crowd-high-btn"
                  onClick={() => setCrowdLevel('HIGH')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    crowdLevel === 'HIGH'
                      ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/20 font-black'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-orange-500/40'
                  }`}
                >
                  <span>HIGH (81-120%)</span>
                  <span className="text-[10px] font-normal opacity-90">Heavy Queues</span>
                </button>

                <button
                  type="button"
                  id="crowd-veryhigh-btn"
                  onClick={() => setCrowdLevel('VERY_HIGH')}
                  className={`p-3.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                    crowdLevel === 'VERY_HIGH'
                      ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30 font-black animate-pulse'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-rose-500/40'
                  }`}
                >
                  <span>VERY HIGH (&gt;120%)</span>
                  <span className="text-[10px] font-normal opacity-90">Overcrowded</span>
                </button>
              </div>
            </div>

            {/* 2. Manual Override Reason */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                2. Reason for Status / Field Surveillance Observation Note *
              </label>
              <textarea
                required
                rows={2}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="e.g. Heavy weekend outflow towards Mumbai; additional reserve buses deployed on Bay 3"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* 3. Availability Numbers & Waiting Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Bus className="w-3.5 h-3.5 text-amber-400" />
                  Available Buses
                </label>
                <input
                  type="number"
                  min={0}
                  max={200}
                  value={busesAvailable}
                  onChange={(e) => setBusesAvailable(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Train className="w-3.5 h-3.5 text-blue-400" />
                  Available Trains
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={trainsAvailable}
                  onChange={(e) => setTrainsAvailable(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-rose-400" />
                  Wait Time (Mins)
                </label>
                <input
                  type="number"
                  min={1}
                  max={180}
                  value={waitTimeMinutes}
                  onChange={(e) => setWaitTimeMinutes(parseInt(e.target.value) || 5)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* 4. Live Station Announcement Broadcast */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Broadcast Official Announcement to Passenger App</span>
                <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="e.g. Special express services to Hinjewadi departing every 15 mins from Portico."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="btn-submit-staff-update"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Publish Official Field Update</span>
            </button>
          </form>

          {/* Right Col: Live Station Status Card */}
          <div className="space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Station Telemetry</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">LIVE</span>
              </div>

              <div>
                <h4 className="font-bold text-white text-base">{selectedLocation.name}</h4>
                <p className="text-xs text-slate-400">{selectedLocation.marathiName}</p>
                <div className="text-xs text-slate-500 mt-1">{selectedLocation.city} • {selectedLocation.division}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px] font-bold">Capacity / Hr</div>
                  <div className="text-sm font-black text-white">{selectedLocation.capacityPerHr.toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px] font-bold">Est. Demand</div>
                  <div className="text-sm font-black text-amber-400">{selectedLocation.currentEstimatedDemand.toLocaleString()}</div>
                </div>
              </div>

              {selectedLocation.activeAnnouncements.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-[11px]">
                    <Volume2 className="w-3 h-3" /> Active Broadcast:
                  </span>
                  <p className="text-[11px] text-amber-200/90">{selectedLocation.activeAnnouncements[0]}</p>
                </div>
              )}
            </div>

            {/* Quick Shift Summary */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-2 text-xs">
              <span className="font-bold text-slate-300 uppercase tracking-wider block">Station Operational Guidelines</span>
              <ul className="space-y-1.5 text-slate-400 list-disc list-inside text-[11px]">
                <li>Update crowd density at 30-minute intervals during peak hours.</li>
                <li>Mark as VERY HIGH when bay queues exceed capacity.</li>
                <li>Verify backup bus bays before issuing passenger alerts.</li>
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* ======================= 2. DEPOT REGISTRY VIEW ======================= */}
      {activeSubTab === 'node_registry' && (
        <div className="space-y-5">
          {/* Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search station or division..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-semibold"
              >
                <option value="ALL">All Node Types</option>
                <option value="BUS_STAND">MSRTC Bus Stands</option>
                <option value="RAILWAY_STATION">Railway Stations</option>
                <option value="INTERMODAL_HUB">Intermodal Hubs</option>
              </select>
            </div>

            <button
              onClick={() => setShowRegModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register New Node</span>
            </button>
          </div>

          {/* Node Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => {
                  setSelectedLocationId(loc.id);
                  setActiveSubTab('duty_desk');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  loc.id === selectedLocationId
                    ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">{loc.name}</h4>
                    <span className="text-[11px] text-slate-400">{loc.city} • {loc.district}</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      loc.crowdLevel === 'VERY_HIGH'
                        ? 'bg-rose-500/20 text-rose-300'
                        : loc.crowdLevel === 'HIGH'
                        ? 'bg-orange-500/20 text-orange-300'
                        : loc.crowdLevel === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {loc.crowdLevel}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 font-mono mb-3">{loc.division}</p>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">Buses</span>
                    <span className="font-bold text-amber-400">{loc.currentBusesAvailable}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">Trains</span>
                    <span className="font-bold text-blue-400">{loc.currentTrainsAvailable}</span>
                  </div>
                  <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">Wait</span>
                    <span className="font-bold text-white">{loc.estimatedWaitTimeMin}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal to Register New Transport Location */}
          {showRegModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-400" />
                    <span>Register New Transport Node / Depot</span>
                  </h3>
                  <button
                    onClick={() => setShowRegModal(false)}
                    className="text-slate-400 hover:text-white text-xs font-bold"
                  >
                    ✕ Close
                  </button>
                </div>

                {regSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Node successfully registered and active in Maharashtra network!</span>
                  </div>
                )}

                <form onSubmit={handleRegisterNode} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Official Name (English) *</label>
                    <input
                      required
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Swargate MSRTC Central Bus Stand"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Official Name (Marathi)</label>
                    <input
                      type="text"
                      value={regMarathiName}
                      onChange={(e) => setRegMarathiName(e.target.value)}
                      placeholder="उदा. स्वारगेट मध्यवर्ती बस स्थानक"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">City / District</label>
                      <input
                        type="text"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Node Type</label>
                      <select
                        value={regType}
                        onChange={(e) => setRegType(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      >
                        <option value="BUS_STAND">MSRTC Bus Stand</option>
                        <option value="RAILWAY_STATION">Railway Station</option>
                        <option value="INTERMODAL_HUB">Intermodal Transit Hub</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Capacity (Pax / Hr)</label>
                      <input
                        type="number"
                        value={regCapacity}
                        onChange={(e) => setRegCapacity(parseInt(e.target.value) || 1000)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 mb-1">Initial Demand</label>
                      <input
                        type="number"
                        value={regInitialDemand}
                        onChange={(e) => setRegInitialDemand(parseInt(e.target.value) || 400)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg mt-2 flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Confirm & Register Node</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= 3. AUDIT TRAIL VIEW ======================= */}
      {activeSubTab === 'audit_trail' && (
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>State-Wide Staff Field Surveillance Logs</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{staffLogs.length} total entries</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {staffLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{log.locationName}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        log.crowdLevel === 'VERY_HIGH'
                          ? 'bg-rose-500/20 text-rose-300'
                          : log.crowdLevel === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-300'
                          : log.crowdLevel === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {log.crowdLevel} ({log.crowdIndex}%)
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">{log.overrideReason}</p>

                {log.announcement && (
                  <p className="text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-[11px]">
                    📢 Broadcast: {log.announcement}
                  </p>
                )}

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-900">
                  <span>Officer: <strong className="text-slate-400">{log.staffName}</strong></span>
                  <span>Buses: <strong className="text-amber-400">{log.busesAvailable}</strong> • Trains: <strong className="text-blue-400">{log.trainsAvailable}</strong> • Wait: <strong className="text-white">{log.waitTimeMinutes}m</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
