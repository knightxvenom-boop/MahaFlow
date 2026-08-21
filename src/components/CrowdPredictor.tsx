import React from 'react';
import { useApp } from '../context/AppContext';
import { generateCrowdPrediction } from '../data/mockTransportData';
import { TrendingUp, Clock, AlertCircle, Sparkles, BrainCircuit, Users, ShieldAlert } from 'lucide-react';
import { CrowdLevel } from '../types';

export const CrowdPredictor: React.FC = () => {
  const { selectedLocation } = useApp();
  const prediction = generateCrowdPrediction(selectedLocation);

  const getLevelColor = (level: CrowdLevel) => {
    switch (level) {
      case 'VERY_HIGH':
        return { text: 'text-rose-400', bg: 'bg-rose-500/20', border: 'border-rose-500/30' };
      case 'HIGH':
        return { text: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
      case 'MODERATE':
        return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
      default:
        return { text: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
    }
  };

  const p30Color = getLevelColor(prediction.plus30.level);
  const p60Color = getLevelColor(prediction.plus60.level);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Predictive Crowd Forecast</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                ESTIMATED
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Historical inflow velocity, peak schedules & capacity ratio
            </p>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 font-mono hidden sm:inline-block">
          Confidence Score: 88%
        </span>
      </div>

      {/* Grid of Predictions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        
        {/* Next 30 Minutes */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                In Next 30 Minutes (+30m)
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${p30Color.bg} ${p30Color.text} ${p30Color.border}`}>
                {prediction.plus30.level.replace('_', ' ')} ({prediction.plus30.index}%)
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-extrabold text-white">{prediction.plus30.demand}</span>
              <span className="text-xs text-slate-400">est. passengers / hr</span>
            </div>

            <p className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <strong className="text-purple-300">Factor:</strong> {prediction.plus30.factor}
            </p>
          </div>
        </div>

        {/* Next 1 Hour */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                In Next 1 Hour (+1h)
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${p60Color.bg} ${p60Color.text} ${p60Color.border}`}>
                {prediction.plus60.level.replace('_', ' ')} ({prediction.plus60.index}%)
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-extrabold text-white">{prediction.plus60.demand}</span>
              <span className="text-xs text-slate-400">est. passengers / hr</span>
            </div>

            <p className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <strong className="text-amber-300">Factor:</strong> {prediction.plus60.factor}
            </p>
          </div>
        </div>

      </div>

      <div className="text-[10px] text-slate-500 flex items-center justify-between">
        <span>Formula: Crowd Index = (Passenger Demand / Station Capacity) × 100</span>
        <span>Simulated AI Model for Maharashtra Transit</span>
      </div>
    </div>
  );
};
