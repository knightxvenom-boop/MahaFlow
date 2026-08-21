import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import L from 'leaflet';
import { Bus, Train, AlertTriangle, ShieldCheck, MapPin, Navigation, Info, Radio } from 'lucide-react';
import { CrowdLevel } from '../types';

interface LiveMapProps {
  onSelectLocation?: (locationId: string) => void;
}

export const LiveMap: React.FC<LiveMapProps> = ({ onSelectLocation }) => {
  const { locations, buses, trains, selectedLocationId, setSelectedLocationId, developerSettings } = useApp();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered on Maharashtra (near Pune / Western Maharashtra)
      const map = L.map(mapContainerRef.current, {
        center: [18.75, 73.85],
        zoom: 8,
        zoomControl: true,
        attributionControl: false
      });

      // CartoDB Dark Matter tiles (slick transit look)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      // Keep map alive or clean up
    };
  }, []);

  // Update Markers & Routes whenever state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Draw Route Lines
    buses.forEach((bus) => {
      if (bus.routeCoordinates && bus.routeCoordinates.length > 1) {
        L.polyline(bus.routeCoordinates, {
          color: '#f59e0b',
          weight: 3,
          opacity: 0.5,
          dashArray: '6, 8'
        }).addTo(markersGroup);
      }
    });

    trains.forEach((train) => {
      if (train.routeCoordinates && train.routeCoordinates.length > 1) {
        L.polyline(train.routeCoordinates, {
          color: '#3b82f6',
          weight: 4,
          opacity: 0.6,
          dashArray: '10, 6'
        }).addTo(markersGroup);
      }
    });

    // 2. Add Station / Stand Markers
    locations.forEach((loc) => {
      const isSelected = loc.id === selectedLocationId;
      const crowdColor =
        loc.crowdLevel === 'VERY_HIGH'
          ? '#ef4444'
          : loc.crowdLevel === 'HIGH'
          ? '#f97316'
          : loc.crowdLevel === 'MODERATE'
          ? '#eab308'
          : '#10b981';

      const iconHtml = `
        <div style="
          background-color: ${crowdColor};
          width: ${isSelected ? '32px' : '24px'};
          height: ${isSelected ? '32px' : '24px'};
          border-radius: 50%;
          border: 3px solid #ffffff;
          box-shadow: 0 0 ${isSelected ? '16px' : '8px'} ${crowdColor};
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s;
        ">
          ${loc.type === 'RAILWAY_STATION' ? '🚆' : loc.type === 'BUS_STAND' ? '🚌' : '🔄'}
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-station-pin',
        html: iconHtml,
        iconSize: isSelected ? [32, 32] : [24, 24],
        iconAnchor: isSelected ? [16, 16] : [12, 12]
      });

      const marker = L.marker(loc.coordinates, { icon: customIcon }).addTo(markersGroup);

      // Popup Content
      const popupContent = `
        <div style="font-family: inherit; min-width: 220px; padding: 6px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #94a3b8;">${loc.division}</span>
            <span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background-color: ${crowdColor}20; color: ${crowdColor}; border: 1px solid ${crowdColor}40;">
              ${loc.crowdLevel.replace('_', ' ')} (${loc.crowdIndex}%)
            </span>
          </div>
          <h4 style="font-size: 13px; font-weight: 700; color: #ffffff; margin: 0 0 2px 0;">${loc.name}</h4>
          ${loc.marathiName ? `<p style="font-size: 11px; color: #cbd5e1; margin: 0 0 6px 0;">${loc.marathiName}</p>` : ''}
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; font-size: 11px; margin-bottom: 6px; background: rgba(0,0,0,0.3); padding: 6px; border-radius: 6px;">
            <div>
              <span style="color: #94a3b8; font-size: 10px;">Available Buses:</span>
              <div style="font-weight: 700; color: #f59e0b;">${loc.currentBusesAvailable} Units</div>
            </div>
            <div>
              <span style="color: #94a3b8; font-size: 10px;">Available Trains:</span>
              <div style="font-weight: 700; color: #38bdf8;">${loc.currentTrainsAvailable} Units</div>
            </div>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 6px;">
            Est. Wait Time: <strong style="color: #ffffff;">${loc.estimatedWaitTimeMin} mins</strong>
          </div>
          <button id="btn-select-${loc.id}" style="width: 100%; padding: 6px; background: #f59e0b; color: #0f172a; border: none; border-radius: 6px; font-weight: 700; font-size: 11px; cursor: pointer;">
            Select Location & View Timetable
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${loc.id}`);
        if (btn) {
          btn.onclick = () => {
            setSelectedLocationId(loc.id);
            if (onSelectLocation) onSelectLocation(loc.id);
          };
        }
      });
    });

    // 3. Add Live Moving Buses
    buses.forEach((bus) => {
      const busIconHtml = `
        <div style="
          background: #f59e0b;
          color: #0f172a;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 10px rgba(245, 158, 11, 0.6);
          font-size: 13px;
        ">
          🚌
        </div>
      `;

      const busIcon = L.divIcon({
        className: 'bus-moving-marker',
        html: busIconHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const busMarker = L.marker(bus.currentCoords, { icon: busIcon }).addTo(markersGroup);

      const busPopup = `
        <div style="padding: 6px; min-width: 200px; color: #f8fafc;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
            <span style="font-size: 9px; background: #f59e0b20; color: #f59e0b; border: 1px solid #f59e0b40; padding: 1px 4px; border-radius: 3px; font-weight: 700;">BUS LIVE</span>
            <span style="font-size: 11px; font-family: monospace; font-weight: 700;">${bus.busNumber}</span>
          </div>
          <h4 style="font-size: 12px; font-weight: 700; color: #ffffff; margin: 2px 0;">${bus.serviceName}</h4>
          <p style="font-size: 10px; color: #94a3b8; margin: 0 0 6px 0;">${bus.source} ➔ ${bus.destination}</p>
          <div style="display: flex; justify-content: space-between; font-size: 10px; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px;">
            <span>Speed: <strong style="color: #38bdf8;">${bus.speedKmH} km/h</strong></span>
            <span>Occupancy: <strong style="color: #f59e0b;">${bus.occupancyPercent}%</strong></span>
          </div>
          <div style="font-size: 9px; color: #64748b; margin-top: 4px;">
            Data Source: <span style="color: #cbd5e1;">${bus.provenance.replace('_', ' ')}</span>
          </div>
        </div>
      `;
      busMarker.bindPopup(busPopup);
    });

    // 4. Add Live Moving Trains
    trains.forEach((train) => {
      const trainIconHtml = `
        <div style="
          background: #3b82f6;
          color: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.7);
          font-size: 14px;
        ">
          🚆
        </div>
      `;

      const trainIcon = L.divIcon({
        className: 'train-moving-marker',
        html: trainIconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const trainMarker = L.marker(train.currentCoords, { icon: trainIcon }).addTo(markersGroup);

      const trainPopup = `
        <div style="padding: 6px; min-width: 220px; color: #f8fafc;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
            <span style="font-size: 9px; background: #3b82f620; color: #38bdf8; border: 1px solid #3b82f640; padding: 1px 4px; border-radius: 3px; font-weight: 700;">TRAIN LIVE</span>
            <span style="font-size: 11px; font-family: monospace; font-weight: 700;">${train.trainNumber}</span>
          </div>
          <h4 style="font-size: 12px; font-weight: 700; color: #ffffff; margin: 2px 0;">${train.trainName}</h4>
          <p style="font-size: 10px; color: #94a3b8; margin: 0 0 6px 0;">${train.source} ➔ ${train.destination}</p>
          <div style="display: flex; justify-content: space-between; font-size: 10px; background: rgba(0,0,0,0.3); padding: 4px 6px; border-radius: 4px; margin-bottom: 4px;">
            <span>Speed: <strong style="color: #38bdf8;">${train.speedKmH} km/h</strong></span>
            <span>Delay: <strong style="color: ${train.delayMinutes > 0 ? '#f87171' : '#4ade80'};">${train.delayMinutes}m</strong></span>
          </div>
          <div style="font-size: 9px; color: #94a3b8;">
            Current Section: <strong style="color: #ffffff;">${train.currentStation}</strong> ➔ Next: <strong>${train.nextStation}</strong>
          </div>
        </div>
      `;
      trainMarker.bindPopup(trainPopup);
    });
  }, [locations, buses, trains, selectedLocationId]);

  // Center on selected location
  const handleFlyToStation = (locCoords: [number, number]) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(locCoords, 12, { duration: 1.2 });
    }
  };

  const selectedLoc = locations.find((l) => l.id === selectedLocationId);

  return (
    <div className="relative w-full h-[600px] sm:h-[680px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 flex flex-col">
      {/* Top Banner indicating Provenance & Live Simulation Disclaimer */}
      <div className="absolute top-3 left-3 right-3 z-[1000] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Provenance Badge */}
        <div className="pointer-events-auto bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2 text-xs">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Live Maharashtra GPS Telemetry</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase font-mono">
                SIMULATED DEMO
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Moving buses & trains along actual Pune-Mumbai-Nashik transport corridors
            </p>
          </div>
        </div>

        {/* Quick Fly-To Selected Station Button */}
        {selectedLoc && (
          <button
            onClick={() => handleFlyToStation(selectedLoc.coordinates)}
            className="pointer-events-auto bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl shadow-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Focus {selectedLoc.name.split(' ')[0]}</span>
          </button>
        )}
      </div>

      {/* The Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Bottom Map Legend */}
      <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-slate-400 font-semibold text-[11px]">Crowd Legend:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300 text-[11px]">Low (0-50%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300 text-[11px]">Moderate (51-80%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-slate-300 text-[11px]">High (81-120%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-rose-300 font-bold text-[11px]">Very High (&gt;120%)</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-amber-300">
            🚌 MSRTC Fleet ({buses.length})
          </span>
          <span className="flex items-center gap-1 text-blue-400">
            🚆 Railways Fleet ({trains.length})
          </span>
        </div>
      </div>
    </div>
  );
};
