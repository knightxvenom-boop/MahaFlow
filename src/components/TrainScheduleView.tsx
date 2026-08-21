import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Train, Clock, ArrowRight, ShieldCheck, Search, Filter, AlertTriangle, Users, MapPin, Gauge } from 'lucide-react';
import { TrainSchedule } from '../types';

export const TrainScheduleView: React.FC = () => {
  const { trains, selectedLocation } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [trainTypeFilter, setTrainTypeFilter] = useState<string>('ALL');

  const filteredTrains = trains.filter((train) => {
    const matchesSearch =
      train.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.currentStation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      trainTypeFilter === 'ALL' ||
      (trainTypeFilter === 'VANDE_BHARAT' && train.trainType === 'Vande Bharat') ||
      (trainTypeFilter === 'SUPERFAST' && train.trainType === 'Superfast') ||
      (trainTypeFilter === 'LOCAL' && train.trainType === 'Suburban Local');

    return matchesSearch && matchesType;
  });

  const getStatusBadge = (train: TrainSchedule) => {
    if (train.delayMinutes > 0) {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Delayed by {train.delayMinutes}m
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        On Time ({train.platform})
      </span>
    );
  };

  const getCrowdPill = (level: string) => {
    switch (level) {
      case 'VERY_HIGH':
        return <span className="text-[10px] font-bold text-rose-400">Very High Rush</span>;
      case 'HIGH':
        return <span className="text-[10px] font-bold text-orange-400">High</span>;
      case 'MODERATE':
        return <span className="text-[10px] font-bold text-amber-400">Moderate</span>;
      default:
        return <span className="text-[10px] font-bold text-emerald-400">Seats Available</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Indian Railways (e.g. 22225, Vande Bharat, Deccan Queen...)"
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setTrainTypeFilter('ALL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              trainTypeFilter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Trains
          </button>
          <button
            onClick={() => setTrainTypeFilter('VANDE_BHARAT')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              trainTypeFilter === 'VANDE_BHARAT' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Vande Bharat Exp
          </button>
          <button
            onClick={() => setTrainTypeFilter('SUPERFAST')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              trainTypeFilter === 'SUPERFAST' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Superfast / Intercity
          </button>
          <button
            onClick={() => setTrainTypeFilter('LOCAL')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              trainTypeFilter === 'LOCAL' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Suburban Local
          </button>
        </div>
      </div>

      {/* Train List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredTrains.map((train) => (
          <div
            key={train.id}
            id={`train-card-${train.id}`}
            className="bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 sm:p-5 transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      #{train.trainNumber}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {train.trainType}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {train.provenance.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-white mt-1">{train.trainName}</h3>
                </div>
                {getStatusBadge(train)}
              </div>

              {/* Route */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200 my-2.5 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                <div className="truncate text-blue-200">{train.source}</div>
                <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
                <div className="truncate text-blue-300 font-bold">{train.destination}</div>
              </div>

              {/* Current Tracking Block */}
              <div className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-3 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Current Tracking Station</span>
                  <span className="font-bold text-white flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {train.currentStation}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Next Halt</span>
                  <span className="font-bold text-amber-300">{train.nextStation}</span>
                </div>
              </div>

              {/* Coach-wise Crowd Breakdown */}
              <div className="mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Coach Class Crowd Index
                </span>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">General (GS)</span>
                    {getCrowdPill(train.crowdScoreByCategory.general)}
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Sleeper (SL)</span>
                    {getCrowdPill(train.crowdScoreByCategory.sleeper)}
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">AC Chair / 3A</span>
                    {getCrowdPill(train.crowdScoreByCategory.ac)}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Scheduled Arr</span>
                  <span className="font-mono font-bold text-white text-xs">{train.scheduledArrival}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Live Speed</span>
                  <span className="font-mono font-bold text-blue-400 text-xs">{train.speedKmH} km/h</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[11px] font-bold text-white bg-blue-600/80 px-2.5 py-1 rounded-lg border border-blue-400/40">
                <span>{train.platform}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredTrains.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            <Train className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <p className="font-semibold text-sm">No trains found for your query</p>
          </div>
        )}
      </div>
    </div>
  );
};
