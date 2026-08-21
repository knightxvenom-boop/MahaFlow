import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bus, MapPin, Clock, ArrowRight, ShieldCheck, Search, Filter, AlertTriangle, Users, Navigation } from 'lucide-react';
import { BusSchedule } from '../types';

export const BusScheduleView: React.FC = () => {
  const { buses, selectedLocation, setSelectedLocationId } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');

  // Filter buses relevant to selected city/location or search
  const filteredBuses = buses.filter((bus) => {
    const matchesSearch =
      bus.busNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.viaRoutes.some((r) => r.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      selectedTypeFilter === 'ALL' ||
      (selectedTypeFilter === 'SHIVNERI' && bus.serviceName.includes('Shivneri')) ||
      (selectedTypeFilter === 'ESHIVAI' && bus.serviceName.includes('Shivai')) ||
      (selectedTypeFilter === 'LALPARI' && bus.serviceName.includes('Lal Pari')) ||
      (selectedTypeFilter === 'ASIAD' && bus.serviceName.includes('Hirkani'));

    return matchesSearch && matchesType;
  });

  const getStatusBadge = (bus: BusSchedule) => {
    if (bus.delayMinutes > 0) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Delayed {bus.delayMinutes}m
        </span>
      );
    }
    if (bus.status === 'BOARDING') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
          Boarding ({bus.platformBay})
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        On Time ({bus.platformBay})
      </span>
    );
  };

  const getProvenanceBadge = (prov: string) => {
    switch (prov) {
      case 'STAFF_UPDATED':
        return <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">STAFF UPDATED</span>;
      default:
        return <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LIVE AIS 140</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search MSRTC bus (e.g. Shivneri, Kolhapur, MH-14...)"
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTypeFilter('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'ALL' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Buses
          </button>
          <button
            onClick={() => setSelectedTypeFilter('SHIVNERI')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'SHIVNERI' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Shivneri AC
          </button>
          <button
            onClick={() => setSelectedTypeFilter('ESHIVAI')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'ESHIVAI' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            E-Shivai Electric
          </button>
          <button
            onClick={() => setSelectedTypeFilter('LALPARI')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'LALPARI' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Lal Pari
          </button>
          <button
            onClick={() => setSelectedTypeFilter('ASIAD')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTypeFilter === 'ASIAD' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Hirkani Asiad
          </button>
        </div>
      </div>

      {/* Bus Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredBuses.map((bus) => (
          <div
            key={bus.id}
            id={`bus-card-${bus.id}`}
            className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 transition-all shadow-lg flex flex-col justify-between"
          >
            {/* Top row */}
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {bus.busNumber}
                    </span>
                    {getProvenanceBadge(bus.provenance)}
                  </div>
                  <h3 className="font-bold text-base text-white mt-1">{bus.serviceName}</h3>
                </div>
                {getStatusBadge(bus)}
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 my-2.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="truncate text-amber-200">{bus.source}</div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="truncate text-amber-300 font-bold">{bus.destination}</div>
              </div>

              {/* Via Stops */}
              {bus.viaRoutes && bus.viaRoutes.length > 0 && (
                <div className="text-[11px] text-slate-400 mb-3 flex flex-wrap items-center gap-1">
                  <span className="text-slate-500 font-medium">Via:</span>
                  {bus.viaRoutes.map((stop, idx) => (
                    <span key={idx} className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                      {stop}
                      {idx < bus.viaRoutes.length - 1 ? ' •' : ''}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Row Metrics */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Departure</span>
                  <span className="font-mono font-bold text-white text-xs">{bus.expectedDeparture}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Speed / GPS</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">{bus.speedKmH} km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Occupancy</span>
                  <span className={`font-mono font-bold text-xs ${bus.occupancyPercent > 85 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {bus.occupancyPercent}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-lg">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>{bus.platformBay}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredBuses.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            <Bus className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="font-semibold text-sm">No buses found matching your criteria</p>
            <p className="text-xs text-slate-500 mt-1">Try switching depot or clearing search query</p>
          </div>
        )}
      </div>
    </div>
  );
};
