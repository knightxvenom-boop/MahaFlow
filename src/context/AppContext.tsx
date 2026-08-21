import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  TransportLocation,
  BusSchedule,
  TrainSchedule,
  StaffUpdateLog,
  DeveloperAccessCode,
  UserProfile,
  DeveloperSettings,
  UserRole,
  CrowdLevel
} from '../types';
import {
  INITIAL_LOCATIONS,
  INITIAL_BUSES,
  INITIAL_TRAINS,
  INITIAL_STAFF_LOGS,
  INITIAL_DEVELOPER_CODES,
  AUTHORIZED_DEVELOPER_EMAILS,
  calculateCrowdIndex
} from '../data/mockTransportData';

interface AppContextType {
  currentUser: UserProfile;
  locations: TransportLocation[];
  buses: BusSchedule[];
  trains: TrainSchedule[];
  staffLogs: StaffUpdateLog[];
  developerCodes: DeveloperAccessCode[];
  developerSettings: DeveloperSettings;
  selectedLocationId: string;
  setSelectedLocationId: (id: string) => void;
  selectedLocation: TransportLocation;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  previewDeviceMode: 'auto' | 'mobile' | 'desktop';
  setPreviewDeviceMode: (mode: 'auto' | 'mobile' | 'desktop') => void;
  externalSyncLogs: string[];
  authorizedDeveloperEmails: string[];
  
  // Actions
  signInWithGoogle: (data: { name: string; email: string; phone: string; accessCode?: string }) => { success: boolean; message: string; role: UserRole };
  logout: () => void;
  redeemAccessCode: (code: string) => { success: boolean; message: string; role?: UserRole };
  generateNewAccessCode: (role: UserRole, description: string) => DeveloperAccessCode;
  toggleCodeActive: (codeId: string) => void;
  updateDeveloperSettings: (settings: Partial<DeveloperSettings>) => void;
  updateCrowdByStaff: (params: {
    locationId: string;
    crowdLevel: CrowdLevel;
    overrideReason?: string;
    busesAvailable?: number;
    trainsAvailable?: number;
    waitTimeMinutes?: number;
    announcement?: string;
  }) => void;
  registerNewTransportLocation: (locationData: Omit<TransportLocation, 'id' | 'lastUpdatedTime' | 'updatedBy' | 'provenance' | 'crowdIndex'>) => void;
  triggerExternalScheduleSync: (serviceType?: 'MSRTC' | 'IRCTC' | 'ALL') => void;
  updateBusSchedule: (busId: string, updates: Partial<BusSchedule>) => void;
  updateTrainSchedule: (trainId: string, updates: Partial<TrainSchedule>) => void;
}

const UNAUTHENTICATED_USER: UserProfile = {
  email: '',
  name: 'Passenger Guest',
  phone: '',
  avatarUrl: '',
  role: 'user',
  isGoogleAuthed: false,
  registeredAt: ''
};

const DEFAULT_SETTINGS: DeveloperSettings = {
  isMaintenanceMode: false,
  maintenanceReason: 'Scheduled Maharashtra Transit Network Infrastructure Upgrade & Database Optimization. Services will resume shortly.',
  appName: 'MahaFlow',
  appLogoUrl: '',
  currentDataSource: 'STAFF_HYBRID',
  externalSyncEnabled: true,
  lastExternalSyncTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  autoCrowdDecay: false
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or defaults
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('mahaflow_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isGoogleAuthed) {
          const isDev = parsed.email && AUTHORIZED_DEVELOPER_EMAILS.some(
            (devEmail) => devEmail.toLowerCase() === parsed.email.toLowerCase()
          );
          if (isDev) {
            return { ...parsed, role: 'developer' as UserRole };
          }
          return parsed;
        }
      } catch (err) {
        console.error('Error parsing stored user:', err);
      }
    }
    return UNAUTHENTICATED_USER;
  });

  const [locations, setLocations] = useState<TransportLocation[]>(() => {
    const saved = localStorage.getItem('mahaflow_locations');
    return saved ? JSON.parse(saved) : INITIAL_LOCATIONS;
  });

  const [buses, setBuses] = useState<BusSchedule[]>(() => {
    const saved = localStorage.getItem('mahaflow_buses');
    return saved ? JSON.parse(saved) : INITIAL_BUSES;
  });

  const [trains, setTrains] = useState<TrainSchedule[]>(() => {
    const saved = localStorage.getItem('mahaflow_trains');
    return saved ? JSON.parse(saved) : INITIAL_TRAINS;
  });

  const [staffLogs, setStaffLogs] = useState<StaffUpdateLog[]>(() => {
    const saved = localStorage.getItem('mahaflow_staff_logs');
    return saved ? JSON.parse(saved) : INITIAL_STAFF_LOGS;
  });

  const [developerCodes, setDeveloperCodes] = useState<DeveloperAccessCode[]>(() => {
    const saved = localStorage.getItem('mahaflow_dev_codes');
    return saved ? JSON.parse(saved) : INITIAL_DEVELOPER_CODES;
  });

  const [developerSettings, setDeveloperSettings] = useState<DeveloperSettings>(() => {
    const saved = localStorage.getItem('mahaflow_dev_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [selectedLocationId, setSelectedLocationId] = useState<string>('loc-pune-station');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'auto' | 'mobile' | 'desktop'>('auto');
  const [externalSyncLogs, setExternalSyncLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] IRCTC Central Railway Webhook Gateway connected. Sync interval: 60s`,
    `[${new Date().toLocaleTimeString()}] MSRTC Bus Live Telemetry Bridge online. Tracking active vehicles.`
  ]);

  // Persist states
  useEffect(() => {
    localStorage.setItem('mahaflow_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mahaflow_locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('mahaflow_buses', JSON.stringify(buses));
  }, [buses]);

  useEffect(() => {
    localStorage.setItem('mahaflow_trains', JSON.stringify(trains));
  }, [trains]);

  useEffect(() => {
    localStorage.setItem('mahaflow_staff_logs', JSON.stringify(staffLogs));
  }, [staffLogs]);

  useEffect(() => {
    localStorage.setItem('mahaflow_dev_codes', JSON.stringify(developerCodes));
  }, [developerCodes]);

  useEffect(() => {
    localStorage.setItem('mahaflow_dev_settings', JSON.stringify(developerSettings));
  }, [developerSettings]);

  const selectedLocation = locations.find((l) => l.id === selectedLocationId) || locations[0];

  // GPS Simulation Loop: advances buses and trains on map smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Move Buses
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          if (!bus.routeCoordinates || bus.routeCoordinates.length < 2) return bus;
          const coords = bus.routeCoordinates;
          let nextIndex = (bus.currentRouteIndex + 1) % coords.length;
          const currentTarget = coords[nextIndex];
          const curr = bus.currentCoords;
          
          // Interpolate step
          const step = 0.08;
          const newLat = curr[0] + (currentTarget[0] - curr[0]) * step;
          const newLng = curr[1] + (currentTarget[1] - curr[1]) * step;
          
          const dist = Math.hypot(currentTarget[0] - newLat, currentTarget[1] - newLng);
          if (dist < 0.005) {
            nextIndex = (nextIndex + 1) % coords.length;
          }

          // Compute rough heading
          const angle = Math.atan2(currentTarget[1] - curr[1], currentTarget[0] - curr[0]) * (180 / Math.PI);
          const heading = (angle + 360) % 360;

          return {
            ...bus,
            currentCoords: [newLat, newLng],
            currentRouteIndex: nextIndex,
            heading: Math.round(heading),
            speedKmH: Math.round(55 + Math.random() * 25)
          };
        })
      );

      // 2. Move Trains
      setTrains((prevTrains) =>
        prevTrains.map((train) => {
          if (!train.routeCoordinates || train.routeCoordinates.length < 2) return train;
          const coords = train.routeCoordinates;
          let nextIndex = (train.currentRouteIndex + 1) % coords.length;
          const currentTarget = coords[nextIndex];
          const curr = train.currentCoords;
          
          const step = 0.05;
          const newLat = curr[0] + (currentTarget[0] - curr[0]) * step;
          const newLng = curr[1] + (currentTarget[1] - curr[1]) * step;
          
          const dist = Math.hypot(currentTarget[0] - newLat, currentTarget[1] - newLng);
          if (dist < 0.004) {
            nextIndex = (nextIndex + 1) % coords.length;
          }

          return {
            ...train,
            currentCoords: [newLat, newLng],
            currentRouteIndex: nextIndex,
            speedKmH: Math.round(80 + Math.random() * 35)
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Auth: Google Sign-in & Code Elevation
  const signInWithGoogle = useCallback(
    ({ name, email, phone, accessCode }: { name: string; email: string; phone: string; accessCode?: string }): { success: boolean; message: string; role: UserRole } => {
      const normalizedEmail = (email || '').trim().toLowerCase();
      const isPreAuthorizedDeveloper = AUTHORIZED_DEVELOPER_EMAILS.some(
        (devEmail) => devEmail.toLowerCase() === normalizedEmail
      );

      let role: UserRole = isPreAuthorizedDeveloper ? 'developer' : 'user';
      let codeUsed: string | undefined = isPreAuthorizedDeveloper ? 'DEV-MASTER-999' : undefined;

      if (accessCode && accessCode.trim()) {
        const trimmed = accessCode.trim().toUpperCase();
        const matchedCode = developerCodes.find((c) => c.code.toUpperCase() === trimmed && c.isActive);
        if (matchedCode) {
          if (!isPreAuthorizedDeveloper) {
            role = matchedCode.roleToGrant;
          }
          codeUsed = matchedCode.code;

          // Record in redeemed list
          setDeveloperCodes((prev) =>
            prev.map((c) => {
              if (c.id === matchedCode.id) {
                const alreadyRedeemed = c.redeemedBy.some((r) => r.email.toLowerCase() === email.toLowerCase());
                const updatedList = alreadyRedeemed
                  ? c.redeemedBy
                  : [
                      ...c.redeemedBy,
                      {
                        name,
                        email,
                        phone,
                        redeemedAt: new Date().toISOString(),
                        roleGranted: role
                      }
                    ];
                return {
                  ...c,
                  redeemedCount: updatedList.length,
                  redeemedBy: updatedList
                };
              }
              return c;
            })
          );
        } else if (!isPreAuthorizedDeveloper) {
          return { success: false, message: 'Invalid or deactivated Developer Access Code. Please check or proceed as Passenger.', role: 'user' };
        }
      }

      const newUser: UserProfile = {
        name: name || (isPreAuthorizedDeveloper ? (normalizedEmail.includes('venom') ? 'VenomX Developer' : 'VisionX Developer') : 'Google User'),
        email: email || 'user@gmail.com',
        phone: phone || '+91 98810 99887',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || email)}`,
        role,
        isGoogleAuthed: true,
        joinedViaCode: codeUsed,
        registeredAt: new Date().toISOString()
      };

      setCurrentUser(newUser);
      return {
        success: true,
        message: role === 'developer'
          ? (isPreAuthorizedDeveloper ? `Developer access granted to ${email} (Root Access Activated)!` : 'Elevated to Developer status!')
          : role === 'staff'
          ? 'Elevated to Admin Staff status!'
          : 'Signed in successfully as Passenger.',
        role
      };
    },
    [developerCodes]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('mahaflow_user');
    setCurrentUser(UNAUTHENTICATED_USER);
  }, []);

  const redeemAccessCode = useCallback(
    (code: string) => {
      const trimmed = code.trim().toUpperCase();
      const matched = developerCodes.find((c) => c.code.toUpperCase() === trimmed && c.isActive);

      if (!matched) {
        return { success: false, message: 'Code does not exist or is inactive.' };
      }

      const newRole = matched.roleToGrant;
      setCurrentUser((prev) => ({
        ...prev,
        role: newRole,
        joinedViaCode: matched.code
      }));

      setDeveloperCodes((prev) =>
        prev.map((c) => {
          if (c.id === matched.id) {
            const alreadyRedeemed = c.redeemedBy.some((r) => r.email.toLowerCase() === currentUser.email.toLowerCase());
            const updated = alreadyRedeemed
              ? c.redeemedBy
              : [
                  ...c.redeemedBy,
                  {
                    name: currentUser.name,
                    email: currentUser.email,
                    phone: currentUser.phone,
                    redeemedAt: new Date().toISOString(),
                    roleGranted: newRole
                  }
                ];
            return {
              ...c,
              redeemedCount: updated.length,
              redeemedBy: updated
            };
          }
          return c;
        })
      );

      return {
        success: true,
        message: `Unlocked ${newRole === 'staff' ? 'ADMIN STAFF' : newRole.toUpperCase()} permissions successfully!`,
        role: newRole
      };
    },
    [developerCodes, currentUser]
  );

  const generateNewAccessCode = useCallback(
    (role: UserRole, description: string) => {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      const prefix = role === 'staff' ? 'STAFF-PUN' : 'DEV-SYS';
      const codeString = `${prefix}-${randomDigits}`;

      const newCodeObj: DeveloperAccessCode = {
        id: `code-${Date.now()}`,
        code: codeString,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.name || 'System Developer',
        isActive: true,
        roleToGrant: role,
        description: description || `Access code generated for ${role.toUpperCase()}`,
        redeemedCount: 0,
        redeemedBy: []
      };

      setDeveloperCodes((prev) => [newCodeObj, ...prev]);
      return newCodeObj;
    },
    [currentUser]
  );

  const toggleCodeActive = useCallback((codeId: string) => {
    setDeveloperCodes((prev) =>
      prev.map((c) => (c.id === codeId ? { ...c, isActive: !c.isActive } : c))
    );
  }, []);

  const updateDeveloperSettings = useCallback((settings: Partial<DeveloperSettings>) => {
    setDeveloperSettings((prev) => ({ ...prev, ...settings }));
  }, []);

  // Staff / Admin Crowd & Location Update
  const updateCrowdByStaff = useCallback(
    ({
      locationId,
      crowdLevel,
      overrideReason,
      busesAvailable,
      trainsAvailable,
      waitTimeMinutes,
      announcement
    }: {
      locationId: string;
      crowdLevel: CrowdLevel;
      overrideReason?: string;
      busesAvailable?: number;
      trainsAvailable?: number;
      waitTimeMinutes?: number;
      announcement?: string;
    }) => {
      const now = new Date().toISOString();
      let targetLocName = '';

      setLocations((prev) =>
        prev.map((loc) => {
          if (loc.id === locationId) {
            targetLocName = loc.name;
            // Map crowd level to demand percentage approximation
            let multiplier = 0.4;
            if (crowdLevel === 'MODERATE') multiplier = 0.7;
            if (crowdLevel === 'HIGH') multiplier = 1.05;
            if (crowdLevel === 'VERY_HIGH') multiplier = 1.35;

            const newDemand = Math.round(loc.capacityPerHr * multiplier);
            const { index } = calculateCrowdIndex(newDemand, loc.capacityPerHr);

            const updatedAnnouncements = announcement && announcement.trim()
              ? [announcement.trim(), ...loc.activeAnnouncements.slice(0, 3)]
              : loc.activeAnnouncements;

            return {
              ...loc,
              crowdLevel,
              crowdIndex: index,
              currentEstimatedDemand: newDemand,
              manualOverrideReason: overrideReason || loc.manualOverrideReason,
              currentBusesAvailable: busesAvailable !== undefined ? busesAvailable : loc.currentBusesAvailable,
              currentTrainsAvailable: trainsAvailable !== undefined ? trainsAvailable : loc.currentTrainsAvailable,
              estimatedWaitTimeMin: waitTimeMinutes !== undefined ? waitTimeMinutes : loc.estimatedWaitTimeMin,
              lastUpdatedTime: now,
              updatedBy: `${currentUser.name} (${currentUser.role.toUpperCase()})`,
              provenance: 'STAFF_UPDATED',
              serviceStatus: crowdLevel === 'VERY_HIGH' ? 'HEAVY_RUSH' : loc.serviceStatus,
              activeAnnouncements: updatedAnnouncements
            };
          }
          return loc;
        })
      );

      // Append to Staff Update Log
      const targetLoc = locations.find((l) => l.id === locationId);
      const newLog: StaffUpdateLog = {
        id: `log-${Date.now()}`,
        locationId,
        locationName: targetLocName || targetLoc?.name || 'Maharashtra Station',
        staffId: `STAFF-${currentUser.phone.slice(-4) || '9999'}`,
        staffName: currentUser.name || 'Authorized Duty Staff',
        crowdLevel,
        crowdIndex: crowdLevel === 'VERY_HIGH' ? 135 : crowdLevel === 'HIGH' ? 110 : crowdLevel === 'MODERATE' ? 75 : 40,
        busesAvailable: busesAvailable || targetLoc?.currentBusesAvailable || 10,
        trainsAvailable: trainsAvailable || targetLoc?.currentTrainsAvailable || 0,
        waitTimeMinutes: waitTimeMinutes || targetLoc?.estimatedWaitTimeMin || 15,
        overrideReason: overrideReason || 'Manual field surveillance observation by station staff',
        announcement,
        timestamp: now,
        provenance: 'STAFF_UPDATED'
      };

      setStaffLogs((prev) => [newLog, ...prev]);
    },
    [currentUser, locations]
  );

  // Admin Registers Depot / Station
  const registerNewTransportLocation = useCallback(
    (data: Omit<TransportLocation, 'id' | 'lastUpdatedTime' | 'updatedBy' | 'provenance' | 'crowdIndex'>) => {
      const newId = `loc-custom-${Date.now()}`;
      const { index } = calculateCrowdIndex(data.currentEstimatedDemand, data.capacityPerHr);
      const newLoc: TransportLocation = {
        ...data,
        id: newId,
        crowdIndex: index,
        lastUpdatedTime: new Date().toISOString(),
        updatedBy: `${currentUser.name} (Admin Registration)`,
        provenance: 'STAFF_UPDATED'
      };

      setLocations((prev) => [newLoc, ...prev]);
      setSelectedLocationId(newId);
    },
    [currentUser]
  );

  // IRCTC / MSRTC Timetable Sync Engine
  const triggerExternalScheduleSync = useCallback((serviceType: 'MSRTC' | 'IRCTC' | 'ALL' = 'ALL') => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const logEntries: string[] = [];

    if (serviceType === 'MSRTC' || serviceType === 'ALL') {
      setBuses((prev) =>
        prev.map((b) => {
          const deltaDelay = Math.floor(Math.random() * 6) - 2; // -2 to +4 min
          const newDelay = Math.max(0, b.delayMinutes + deltaDelay);
          const newOccupancy = Math.min(100, Math.max(40, b.occupancyPercent + Math.floor(Math.random() * 8) - 3));
          return {
            ...b,
            delayMinutes: newDelay,
            occupancyPercent: newOccupancy,
            status: newDelay > 10 ? 'DELAYED' : b.status,
            provenance: 'LIVE_API'
          };
        })
      );
      logEntries.push(`[${timestamp}] [MSRTC API] Synchronized 14 active Shivneri, E-Shivai & Ordinary bus routes across Pune, Mumbai, Nashik.`);
    }

    if (serviceType === 'IRCTC' || serviceType === 'ALL') {
      setTrains((prev) =>
        prev.map((t) => {
          const deltaDelay = Math.floor(Math.random() * 5) - 1;
          const newDelay = Math.max(0, t.delayMinutes + deltaDelay);
          return {
            ...t,
            delayMinutes: newDelay,
            status: newDelay > 15 ? 'DELAYED' : 'RUNNING',
            provenance: 'LIVE_API'
          };
        })
      );
      logEntries.push(`[${timestamp}] [IRCTC API] Polled Central & Western Railway live NTES feed. Updated Vande Bharat, Deccan Queen & Local timetables.`);
    }

    setDeveloperSettings((prev) => ({
      ...prev,
      lastExternalSyncTime: timestamp
    }));

    setExternalSyncLogs((prev) => [...logEntries, ...prev.slice(0, 15)]);
  }, []);

  const updateBusSchedule = useCallback((busId: string, updates: Partial<BusSchedule>) => {
    setBuses((prev) => prev.map((b) => (b.id === busId ? { ...b, ...updates } : b)));
  }, []);

  const updateTrainSchedule = useCallback((trainId: string, updates: Partial<TrainSchedule>) => {
    setTrains((prev) => prev.map((t) => (t.id === trainId ? { ...t, ...updates } : t)));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        locations,
        buses,
        trains,
        staffLogs,
        developerCodes,
        developerSettings,
        selectedLocationId,
        setSelectedLocationId,
        selectedLocation,
        isAuthModalOpen,
        setIsAuthModalOpen,
        previewDeviceMode,
        setPreviewDeviceMode,
        externalSyncLogs,
        authorizedDeveloperEmails: AUTHORIZED_DEVELOPER_EMAILS,
        signInWithGoogle,
        logout,
        redeemAccessCode,
        generateNewAccessCode,
        toggleCodeActive,
        updateDeveloperSettings,
        updateCrowdByStaff,
        registerNewTransportLocation,
        triggerExternalScheduleSync,
        updateBusSchedule,
        updateTrainSchedule
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
